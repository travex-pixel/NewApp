"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { NAME_MAX } from "@/lib/group";

/** A single name field and a big button. The only typing in the whole game. */
export function NameForm({
  label,
  cta,
  initial = "",
  busy,
  onSubmit,
}: {
  label: string;
  cta: string;
  initial?: string;
  busy?: boolean;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const ok = name.trim().length > 0;
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (ok && !busy) onSubmit(name.trim());
      }}
    >
      <label className="grid gap-1.5">
        <span className="small font-semibold">{label}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          autoComplete="given-name"
          enterKeyHint="go"
          placeholder="First name or nickname"
          className="option"
          style={{ display: "block", fontSize: "1.0625rem", padding: "0.85rem 1rem", minHeight: 0, cursor: "text" }}
        />
      </label>
      <button type="submit" className="btn btn-block" disabled={!ok || busy}>
        {busy ? "One sec…" : cta} {busy ? null : <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}
