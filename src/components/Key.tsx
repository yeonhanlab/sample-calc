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
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        "key flex h-14 w-full items-center justify-center text-[11px] sm:h-16 sm:text-sm",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {label}
    </button>
  );
}
