import type { ReactNode } from "react";

/**
 * A fixed, full-viewport grid: header, content, footer. The page itself never
 * scrolls. Safe areas are padded top and bottom.
 */
export function GameShell({
  theme = "paper",
  head,
  foot,
  children,
  className = "",
  ...rest
}: {
  theme?: "paper" | "ink";
  head: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div className={`shell grain ${theme === "ink" ? "ink" : ""} ${className}`} {...rest}>
      <header className="shell-head">{head}</header>
      <div className="shell-main">{children}</div>
      {foot ? <footer className="shell-foot">{foot}</footer> : <div />}
    </div>
  );
}
