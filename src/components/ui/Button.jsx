import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "bg-accent text-white font-semibold hover:bg-accent-light active:translate-y-px disabled:hover:bg-accent",
  secondary:
    "bg-transparent text-dim font-medium border border-line-strong hover:text-ink hover:border-dim active:translate-y-px",
  ghost:
    "bg-transparent text-dim font-medium hover:text-ink active:translate-y-px",
  danger:
    "bg-transparent text-bad font-semibold border border-line-strong hover:border-bad active:translate-y-px",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  type = "button",
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  const isNativeButton = Tag === "button";

  return (
    <Tag
      type={isNativeButton ? type : undefined}
      disabled={isNativeButton ? isDisabled : undefined}
      aria-disabled={!isNativeButton && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-control)]",
        "whitespace-nowrap transition-colors duration-150",
        "disabled:opacity-40 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {children}
    </Tag>
  );
}
