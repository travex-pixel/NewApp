/**
 * The fork: one path becoming two. Drawn horizontally so it reads as a road
 * splitting, not as a letter. Used in the wordmark, the favicon, the social
 * image and the empty states.
 */
export function ForkMark({
  size = 20,
  className = "fork",
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M2.5 12H10.5M10.5 12L19.5 4.5M10.5 12L19.5 19.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19.5" cy="4.5" r="2.1" fill="currentColor" />
    </svg>
  );
}
