"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { KeyVariant } from "@/lib/keys";

const VARIANT_CLASS: Record<KeyVariant, string> = {
  num: "key-num bg-gradient-to-b from-[#5a2735] to-[#3b1622] text-cream",
  op: "bg-gradient-to-b from-hot to-hot-2 text-white",
  fn: "bg-gradient-to-b from-pale-2 to-pale text-ink",
  eq: "key-eq bg-gradient-to-b from-[#f89ac2] to-[#e5559a] text-white",
  mem: "bg-gradient-to-b from-[#e7d1da] to-mauve text-ink",
  clr: "bg-gradient-to-b from-[#f6c2d5] to-[#efa9c4] text-ink",
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
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        // one uniform pixel-label size for every key — digits, operators and
        // arrows read at the same scale as "MC" / "M+" / "AC".
        "key flex h-16 w-full items-center justify-center text-[11px] leading-none sm:h-[78px] sm:text-[14px]",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {label}
    </button>
  );
}
