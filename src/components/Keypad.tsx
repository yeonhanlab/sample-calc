"use client";

import { Key } from "./Key";
import { KEY_LAYOUT, type KeyId } from "@/lib/keys";

interface KeypadProps {
  onKey: (id: KeyId) => void;
}

export function Keypad({ onKey }: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {KEY_LAYOUT.map((k) => (
        <Key
          key={k.id}
          label={k.label}
          variant={k.variant}
          ariaLabel={k.aria}
          onPress={() => onKey(k.id)}
        />
      ))}
    </div>
  );
}
