import { cn } from "../../lib/cn";

export default function Card({
  as: Tag = "div",
  padding = "md",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-card)] bg-surface border border-line",
        padding === "sm" && "p-4",
        padding === "md" && "p-5 sm:p-6",
        padding === "lg" && "p-6 sm:p-8",
        padding === "none" && "p-0",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-ink", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardLabel({ className, children, ...props }) {
  return (
    <p
      className={cn(
        "text-xs font-medium tracking-wide text-dim uppercase",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-dim", className)} {...props}>
      {children}
    </p>
  );
}
