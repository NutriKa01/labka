"use client";

import { useId } from "react";
import { cn } from "../../lib/cn";

export default function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  id,
  className,
  inputClassName,
  numeric = false,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex items-center gap-2 h-11 px-3.5",
          "rounded-[var(--radius-control)] bg-surface",
          "border transition-colors duration-150",
          error
            ? "border-bad"
            : "border-line hover:border-line-strong focus-within:border-accent"
        )}
      >
        {prefix && (
          <span className="text-sm text-dim select-none">{prefix}</span>
        )}

        <input
          id={inputId}
          inputMode={numeric ? "decimal" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none",
            "text-base text-ink placeholder:text-dim",
            "disabled:text-dim disabled:cursor-not-allowed",
            inputClassName
          )}
          {...props}
        />

        {suffix && (
          <span className="text-sm text-dim select-none">{suffix}</span>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs font-medium text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-dim">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
