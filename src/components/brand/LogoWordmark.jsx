import { cn } from "../../lib/cn";

/**
 * "Lab.Ka" — wordmark da plataforma, serifada com o gradiente
 * metálico dourado. Só a marca Lab.Ka (login/shell) — dentro de uma
 * conta quem aparece é o nome do consultório, não isso.
 */
export default function LogoWordmark({ className = "" }) {
  return (
    <span
      className={cn("font-serif font-medium tracking-tight", className)}
      style={{
        backgroundImage: "var(--gradient-gold)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      Lab.Ka
    </span>
  );
}
