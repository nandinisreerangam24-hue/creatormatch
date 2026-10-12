"use client";

import React, { useState } from "react";
import { UserRole } from "@/lib/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (email: string, role: UserRole) => void;
  onShowToast: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  onShowToast,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("creator");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      onShowToast("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      // Check if Supabase client can be dynamically imported
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (supabase) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: {
                full_name: fullName.trim() || email.split("@")[0],
                role: role,
              },
            },
          });

          if (error) {
            onShowToast(`Sign up failed: ${error.message}`);
            setIsLoading(false);
            return;
          }

          if (data.user) {
            onAuthSuccess(data.user.email || email, role);
            onShowToast("Account created successfully!");
            onClose();
            return;
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });

          if (error) {
            onShowToast(`Login failed: ${error.message}`);
            setIsLoading(false);
            return;
          }

          if (data.user) {
            const userRole = (data.user.user_metadata?.role as UserRole) || role;
            onAuthSuccess(data.user.email || email, userRole);
            onShowToast("Signed in successfully!");
            onClose();
            return;
          }
        }
      }
    } catch {
      // Supabase not configured; proceed with local demo authentication
    }

    // Demo Mode Instant Auth
    setTimeout(() => {
      onAuthSuccess(email.trim(), role);
      onShowToast(`Signed in as ${role.toUpperCase()} (Demo mode)`);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: "440px" }}>
        <button
          className="btn ghost small close"
          style={{ float: "right" }}
          onClick={onClose}
        >
          Close
        </button>

        <h2>{isSignUp ? "Create an account" : "Welcome back"}</h2>
        <p className="sub">
          {isSignUp
            ? "Sign up to publish briefs or manage your AI creator portfolio."
            : "Sign in with your email to continue."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label>Select your role</label>
              <div className="row two" style={{ gap: "8px", marginTop: "4px" }}>
                <button
                  type="button"
                  className={`btn ${role === "creator" ? "" : "ghost"}`}
                  onClick={() => setRole("creator")}
                  style={{ width: "100%", fontSize: "14px", padding: "8px" }}
                >
                  AI Creator
                </button>
                <button
                  type="button"
                  className={`btn ${role === "brand" ? "" : "ghost"}`}
                  onClick={() => setRole("brand")}
                  style={{ width: "100%", fontSize: "14px", padding: "8px" }}
                >
                  Brand / Agency
                </button>
              </div>

              <label htmlFor="authName" style={{ marginTop: "12px" }}>
                Full Name / Agency Name
              </label>
              <input
                id="authName"
                placeholder="Jane Doe or Acme Studios"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <label htmlFor="authEmail">Email address *</label>
          <input
            id="authEmail"
            type="email"
            required
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="authPass">Password *</label>
          <input
            id="authPass"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="actions" style={{ marginTop: "16px" }}>
            <button
              className="btn"
              type="submit"
              disabled={isLoading}
              style={{ width: "100%" }}
            >
              {isLoading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "14px",
              fontSize: "13px",
              color: "var(--muted)",
            }}
          >
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn ghost small"
                  style={{
                    border: "none",
                    color: "var(--brand)",
                    padding: "0 4px",
                    fontWeight: 600,
                  }}
                  onClick={() => setIsSignUp(false)}
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="btn ghost small"
                  style={{
                    border: "none",
                    color: "var(--brand2)",
                    padding: "0 4px",
                    fontWeight: 600,
                  }}
                  onClick={() => setIsSignUp(true)}
                >
                  Create one
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
