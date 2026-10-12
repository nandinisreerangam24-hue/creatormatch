import { Creator } from "./types";

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function unique<T>(arr: T[]): T[] {
  return arr.filter((v, i) => v && arr.indexOf(v) === i);
}

export function verifiedCount(c: Creator): number {
  const v = c.verified || { tools: false, workflows: false, pastWork: false };
  return (v.tools ? 1 : 0) + (v.workflows ? 1 : 0) + (v.pastWork ? 1 : 0);
}

export function hueOf(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 360;
  }
  return h;
}

export function initials(n: string): string {
  if (!n) return "CM";
  return n
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase();
}
