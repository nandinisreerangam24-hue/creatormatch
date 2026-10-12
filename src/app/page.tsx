"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navigation, { TabType } from "@/components/Navigation";
import DiscoverView from "@/components/DiscoverView";
import BriefsView from "@/components/BriefsView";
import EngagementsView from "@/components/EngagementsView";
import JoinView from "@/components/JoinView";
import CreatorModal from "@/components/CreatorModal";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";
import { SEED_CREATORS } from "@/lib/sample-data";
import { Brief, Creator, Engagement, FilterState, UserRole } from "@/lib/types";
import { uid } from "@/lib/utils";
import {
  getSupabaseBriefs,
  getSupabaseCreators,
  getSupabaseEngagements,
  insertSupabaseBrief,
  insertSupabaseCreator,
  insertSupabaseEngagement,
  updateSupabaseEngagement,
  deleteSupabaseBrief,
  deleteSupabaseEngagement,
} from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEYS = {
  creators: "acm_creators_v1",
  briefs: "acm_briefs_v1",
  engagements: "acm_eng_v1",
  auth: "acm_auth_user_v1",
};

const initialFilters: FilterState = {
  q: "",
  spec: "",
  tool: "",
  type: "",
  skills: [],
  verified: false,
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("discover");
  const [creators, setCreators] = useState<Creator[]>(SEED_CREATORS);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data and Supabase Auth
  useEffect(() => {
    async function loadData() {
      // 1. Check local session cache
      try {
        const cachedAuth = localStorage.getItem(STORAGE_KEYS.auth);
        if (cachedAuth) {
          const parsed = JSON.parse(cachedAuth);
          setUserEmail(parsed.email);
          setUserRole(parsed.role);
        }
      } catch {}

      // 2. Check live Supabase Auth session if available
      try {
        const supabase = createClient();
        if (supabase) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            setUserEmail(data.session.user.email || null);
            setUserRole(
              (data.session.user.user_metadata?.role as UserRole) || "creator"
            );
          }
        }
      } catch {}

      // 3. Load Creators from Supabase (or fallback to local / seeds)
      let initialCreators = SEED_CREATORS;
      try {
        const remoteCreators = await getSupabaseCreators();
        if (remoteCreators && remoteCreators.length > 0) {
          initialCreators = remoteCreators;
        } else {
          const stored = localStorage.getItem(STORAGE_KEYS.creators);
          if (stored) {
            initialCreators = JSON.parse(stored);
          }
        }
      } catch {}
      setCreators(initialCreators);

      // 4. Load Briefs from Supabase (or fallback to local)
      let initialBriefs: Brief[] = [];
      try {
        const remoteBriefs = await getSupabaseBriefs();
        if (remoteBriefs) {
          initialBriefs = remoteBriefs;
        } else {
          const stored = localStorage.getItem(STORAGE_KEYS.briefs);
          if (stored) {
            initialBriefs = JSON.parse(stored);
          }
        }
      } catch {}
      setBriefs(initialBriefs);

      // 5. Load Engagements from Supabase (or fallback to local)
      let initialEngagements: Engagement[] = [];
      try {
        const remoteEng = await getSupabaseEngagements();
        if (remoteEng) {
          initialEngagements = remoteEng;
        } else {
          const stored = localStorage.getItem(STORAGE_KEYS.engagements);
          if (stored) {
            initialEngagements = JSON.parse(stored);
          }
        }
      } catch {}
      setEngagements(initialEngagements);

      setIsLoaded(true);
    }

    loadData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.creators, JSON.stringify(creators));
    } catch {}
  }, [creators, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.briefs, JSON.stringify(briefs));
    } catch {}
  }, [briefs, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEYS.engagements,
        JSON.stringify(engagements)
      );
    } catch {}
  }, [engagements, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Auth Handlers
  const handleAuthSuccess = (email: string, role: UserRole) => {
    setUserEmail(email);
    setUserRole(role);
    try {
      localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify({ email, role }));
    } catch {}
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {}
    setUserEmail(null);
    setUserRole(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.auth);
    } catch {}
    showToast("Signed out");
  };

  // Creator Portfolio Modal
  const handleViewPortfolio = (creator: Creator) => {
    setSelectedCreator(creator);
  };

  const handleCloseModal = () => {
    setSelectedCreator(null);
  };

  // Invite Creator to Brief
  const handleInvite = async (creatorId: string, briefId: string) => {
    const exists = engagements.some(
      (e) => e.creatorId === creatorId && e.briefId === briefId
    );
    if (exists) {
      showToast("Already invited for this brief");
      return;
    }

    const newEngagement: Engagement = {
      id: uid(),
      creatorId,
      briefId,
      stage: 0,
      revisions: 0,
      created_at: new Date().toISOString(),
    };

    setEngagements([newEngagement, ...engagements]);
    setSelectedCreator(null);
    showToast("Invitation sent");

    // Persist to Supabase
    await insertSupabaseEngagement(newEngagement);
  };

  // Brief publish & delete
  const handlePublishBrief = async (brief: Brief) => {
    setBriefs([brief, ...briefs]);
    await insertSupabaseBrief(brief);
  };

  const handleDeleteBrief = async (briefId: string) => {
    setBriefs(briefs.filter((b) => b.id !== briefId));
    setEngagements(engagements.filter((e) => e.briefId !== briefId));
    showToast("Brief deleted");
    await deleteSupabaseBrief(briefId);
  };

  const handleFindMatchingCreators = (brief: Brief) => {
    setFilters({ ...initialFilters, type: brief.type });
    setActiveTab("discover");
  };

  // Engagement stage updates
  const handleAdvanceStage = async (engagementId: string) => {
    const target = engagements.find((e) => e.id === engagementId);
    if (!target) return;

    const nextStage = Math.min(target.stage + 1, 5);
    setEngagements(
      engagements.map((e) =>
        e.id === engagementId ? { ...e, stage: nextStage } : e
      )
    );
    await updateSupabaseEngagement(engagementId, nextStage, target.revisions);
  };

  const handleRequestRevision = async (engagementId: string) => {
    const target = engagements.find((e) => e.id === engagementId);
    if (!target) return;

    const newRevisions = target.revisions + 1;
    setEngagements(
      engagements.map((e) =>
        e.id === engagementId
          ? { ...e, stage: 2, revisions: newRevisions } // 2 = "In production"
          : e
      )
    );
    showToast("Revision requested. Creator notified!");
    await updateSupabaseEngagement(engagementId, 2, newRevisions);
  };

  const handleRemoveEngagement = async (engagementId: string) => {
    setEngagements(engagements.filter((e) => e.id !== engagementId));
    showToast("Engagement removed");
    await deleteSupabaseEngagement(engagementId);
  };

  // Creator Onboarding / Publish Profile
  const handlePublishProfile = async (newCreator: Creator) => {
    setCreators([newCreator, ...creators]);
    setFilters(initialFilters);
    setActiveTab("discover");
    await insertSupabaseCreator(newCreator);
  };

  return (
    <>
      <Header
        userEmail={userEmail}
        userRole={userRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo(0, 0);
        }}
        engagementCount={engagements.length}
      />

      <main>
        {activeTab === "discover" && (
          <DiscoverView
            creators={creators}
            filters={filters}
            onFilterChange={setFilters}
            onViewPortfolio={handleViewPortfolio}
            onResetFilters={() => setFilters(initialFilters)}
          />
        )}

        {activeTab === "briefs" && (
          <BriefsView
            briefs={briefs}
            onPublishBrief={handlePublishBrief}
            onDeleteBrief={handleDeleteBrief}
            onFindMatchingCreators={handleFindMatchingCreators}
            onShowToast={showToast}
          />
        )}

        {activeTab === "engagements" && (
          <EngagementsView
            engagements={engagements}
            creators={creators}
            briefs={briefs}
            onAdvanceStage={handleAdvanceStage}
            onRequestRevision={handleRequestRevision}
            onRemoveEngagement={handleRemoveEngagement}
          />
        )}

        {activeTab === "join" && (
          <JoinView
            onPublishProfile={handlePublishProfile}
            onShowToast={showToast}
          />
        )}
      </main>

      <CreatorModal
        creator={selectedCreator}
        briefs={briefs}
        onClose={handleCloseModal}
        onInvite={handleInvite}
        onGoToBriefs={() => setActiveTab("briefs")}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </>
  );
}
