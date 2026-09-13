import { Warning, Info } from "@phosphor-icons/react/dist/ssr";
import Card, { CardTitle } from "./Card";
import { cn } from "../../lib/cn";

const LEVELS = {
  info: { Icon: Info, iconClass: "text-dim", border: "border-line" },
  critical: { Icon: Warning, iconClass: "text-bad", border: "border-bad" },
};

export default function Alert({
  level = "info",
  title,
  children,
  className,
  ...props
}) {
  const { Icon, iconClass, border } = LEVELS[level] ?? LEVELS.info;
  const isCritical = level === "critical";

  return (
    <Card
      role={isCritical ? "alert" : undefined}
      className={cn(border, className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={18}
          weight={isCritical ? "fill" : "regular"}
          aria-hidden="true"
          className={cn("mt-0.5 shrink-0", iconClass)}
        />

        <div className="flex flex-col gap-2">
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          <div className="text-sm text-dim">{children}</div>
        </div>
      </div>
    </Card>
  );
}
