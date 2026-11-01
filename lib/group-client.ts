"use client";

import type { Choice } from "@/lib/content";
import type { GroupInfo, GroupMember } from "@/lib/group";

/** This phone's identity in a group: a random id and the name it chose. */
export interface Me {
  memberId: string;
  name: string;
}

const key = (id: string) => `instinct:group:${id}`;

export function readMe(groupId: string): Me | null {
  try {
    const raw = window.localStorage.getItem(key(groupId));
    if (!raw) return null;
    const me = JSON.parse(raw) as Partial<Me>;
    return typeof me.memberId === "string" && typeof me.name === "string" ? { memberId: me.memberId, name: me.name } : null;
  } catch {
    return null;
  }
}

export function saveMe(groupId: string, name: string): Me {
  const me: Me = { memberId: readMe(groupId)?.memberId ?? crypto.randomUUID().replace(/-/g, "").slice(0, 16), name };
  try {
    window.localStorage.setItem(key(groupId), JSON.stringify(me));
  } catch {
    /* unavailable; this visit still works */
  }
  return me;
}

export type GroupData = { group: GroupInfo; members: GroupMember[] };

export async function fetchGroup(id: string): Promise<GroupData | "missing" | "off"> {
  try {
    const res = await fetch(`/api/group/${id}`, { cache: "no-store" });
    if (res.status === 404) return "missing";
    if (!res.ok) return "off";
    return (await res.json()) as GroupData;
  } catch {
    return "off";
  }
}

export async function submitToGroup(id: string, me: Me, choices: Choice["id"][]): Promise<GroupData | null> {
  try {
    const res = await fetch(`/api/group/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: me.memberId, name: me.name, choices }),
    });
    if (!res.ok) return null;
    return (await res.json()) as GroupData;
  } catch {
    return null;
  }
}

export async function createGroup(name: string): Promise<string | null> {
  try {
    const res = await fetch("/api/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}
