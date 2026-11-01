import Link from "next/link";
import { PACKS, packScenarios } from "@/lib/content/packs";

/** The pack row on the home page. */
export function PackPicker() {
  return (
    <div>
      <p className="label">Or pick a pack</p>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {PACKS.map((p) => (
          <li key={p.id}>
            <Link
              href={`/pack/${p.id}`}
              className="option"
              style={{ display: "block", padding: "0.65rem 0.7rem", textDecoration: "none", minHeight: 0 }}
              aria-label={`${p.name} pack: ${p.blurb}`}
            >
              <span className="block font-semibold" style={{ fontSize: "0.9375rem" }}>
                {p.name}
              </span>
              <span className="block tiny faint mt-0.5 tabular">{packScenarios(p).length} situations</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
