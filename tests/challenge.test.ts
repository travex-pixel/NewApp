import { describe, expect, it } from "vitest";
import { SCENARIOS } from "@/lib/content";
import { decodeChallenge, encodeChallenge } from "@/lib/game/challenge";

describe("challenge codes", () => {
  it("round-trips every scenario and choice", () => {
    for (const s of SCENARIOS) {
      for (const c of s.choices) {
        const code = encodeChallenge(s.id, c.id);
        expect(code).toMatch(/^[a-z0-9]{4}$/);
        const decoded = decodeChallenge(code);
        expect(decoded?.scenario.id).toBe(s.id);
        expect(decoded?.choiceId).toBe(c.id);
      }
    }
  });

  it("does not expose the choice letter in plain text", () => {
    const s = SCENARIOS[3];
    const codes = s.choices.map((c) => encodeChallenge(s.id, c.id)!);
    // Four distinct codes, and the third character is not simply a/b/c/d.
    expect(new Set(codes).size).toBe(4);
    for (const code of codes) expect(code[2]).toMatch(/[0-3]/);
  });

  it("rejects garbage, wrong checksums, and out-of-range indexes", () => {
    expect(decodeChallenge("")).toBeNull();
    expect(decodeChallenge(undefined)).toBeNull();
    expect(decodeChallenge("zzzz")).toBeNull();
    expect(decodeChallenge("abc")).toBeNull();
    expect(decodeChallenge("../..")).toBeNull();
    const good = encodeChallenge(SCENARIOS[0].id, "a")!;
    const tampered = good.slice(0, 3) + (good[3] === "a" ? "b" : "a");
    expect(decodeChallenge(tampered)).toBeNull();
  });

  it("is case- and whitespace-tolerant for pasted links", () => {
    const good = encodeChallenge(SCENARIOS[1].id, "c")!;
    expect(decodeChallenge(` ${good.toUpperCase()} `)?.choiceId).toBe("c");
  });

  it("returns null for unknown scenarios", () => {
    expect(encodeChallenge("not-a-scenario", "a")).toBeNull();
  });
});
