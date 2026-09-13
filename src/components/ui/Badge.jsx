import { cn } from "../../lib/cn";

/**
 * Badge de estado. Usado sobretudo na matriz de marcadores, para
 * sinalizar se um valor caiu dentro ou fora da faixa ideal.
 */
const TONES = {
  default: "text-dim bg-ground border-line-strong",
  good: "text-good bg-good-veil border-transparent",
  warn: "text-warn bg-warn-veil border-transparent",
  bad: "text-bad bg-bad-veil border-transparent",
};

export default function Badge({
  tone = "default",
  icon: Icon,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border",
        "px-2.5 py-1 text-xs font-medium leading-none",
        TONES[tone] ?? TONES.default,
        className
      )}
      {...props}
    >
      {Icon && <Icon size={13} weight="bold" aria-hidden="true" />}
      {children}
    </span>
  );
}
