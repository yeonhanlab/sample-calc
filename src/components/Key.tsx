"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { KeyVariant } from "@/lib/keys";

const VARIANT_CLASS: Record<KeyVariant, string> = {
  num: "bg-plum text-cream",
  op: "bg-pink-hot text-void",
  fn: "bg-grape text-void",
  eq: "bg-pink-bright text-void",
  mem: "bg-berry text-pink-pale",
};

interface KeyProps {
  label: ReactNode;
  onPress: () => void;
  variant?: KeyVariant;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Key({
  label,
  onPress,
  variant = "num",
  ariaLabel,
  disabled,
  className,
}: KeyProps) {
  // Single-glyph keys (digits, operators, "=", ".", "%") get the big pixel
  // treatment; multi-character labels (MC, M+, AC, +/-, …) stay smaller so the
  // chunky pixel font still fits the key.
  const isGlyph = typeof label === "string" && [...label].length <= 1;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        "key flex h-16 w-full items-center justify-center leading-none sm:h-20",
        isGlyph
          ? "text-[26px] sm:text-[34px]"
          : "text-[13px] sm:text-[16px]",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {label}
    </button>
  );
}
