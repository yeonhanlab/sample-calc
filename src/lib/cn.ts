import { twMerge } from "tailwind-merge";

type ClassValue = string | number | false | null | undefined;

/**
 * Join class names and resolve Tailwind conflicts with tailwind-merge.
 * Intentionally dependency-light: no `clsx`, just tailwind-merge.
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
