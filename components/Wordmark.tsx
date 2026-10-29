import Link from "next/link";
import { ForkMark } from "./ForkMark";
import { SITE_NAME } from "@/lib/site";

export function Wordmark({ asLink = true }: { asLink?: boolean }) {
  const inner = (
    <span className="inline-flex items-center gap-1.5">
      <ForkMark size={18} />
      <span
        className="serif"
        style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}
      >
        {SITE_NAME}
      </span>
    </span>
  );
  if (!asLink) return inner;
  return (
    <Link href="/" aria-label={`${SITE_NAME} home`} className="no-underline" style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  );
}
