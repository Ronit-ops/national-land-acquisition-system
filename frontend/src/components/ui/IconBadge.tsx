import type { ReactNode } from "react";

interface IconBadgeProps {
  children: ReactNode;
  label?: string;
  tone?: "primary" | "success" | "warning" | "neutral";
}

function IconBadge({
  children,
  label,
  tone = "primary",
}: IconBadgeProps) {
  return (
    <div className={`icon-badge icon-badge--${tone}`}>
      <span className="icon-badge__icon" aria-hidden="true">
        {children}
      </span>

      {label ? <span className="icon-badge__label">{label}</span> : null}
    </div>
  );
}

export default IconBadge;