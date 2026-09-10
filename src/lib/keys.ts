export type KeyId =
  | "mc"
  | "mr"
  | "m+"
  | "m-"
  | "ac"
  | "back"
  | "pct"
  | "div"
  | "7"
  | "8"
  | "9"
  | "mul"
  | "4"
  | "5"
  | "6"
  | "sub"
  | "1"
  | "2"
  | "3"
  | "add"
  | "neg"
  | "0"
  | "dot"
  | "eq";

export type KeyVariant = "num" | "op" | "fn" | "eq" | "mem" | "clr";

export interface KeyDef {
  id: KeyId;
  label: string;
  variant: KeyVariant;
  aria: string;
}

/** 4 columns x 6 rows, standard pocket-calculator arrangement. */
export const KEY_LAYOUT: readonly KeyDef[] = [
  { id: "mc", label: "MC", variant: "mem", aria: "메모리 지우기" },
  { id: "mr", label: "MR", variant: "mem", aria: "메모리 불러오기" },
  { id: "m+", label: "M+", variant: "mem", aria: "메모리 더하기" },
  { id: "m-", label: "M-", variant: "mem", aria: "메모리 빼기" },

  { id: "ac", label: "AC", variant: "clr", aria: "전체 지우기" },
  { id: "back", label: "←", variant: "fn", aria: "한 글자 지우기" },
  { id: "pct", label: "%", variant: "fn", aria: "퍼센트" },
  { id: "div", label: "÷", variant: "op", aria: "나누기" },

  { id: "7", label: "7", variant: "num", aria: "7" },
  { id: "8", label: "8", variant: "num", aria: "8" },
  { id: "9", label: "9", variant: "num", aria: "9" },
  { id: "mul", label: "×", variant: "op", aria: "곱하기" },

  { id: "4", label: "4", variant: "num", aria: "4" },
  { id: "5", label: "5", variant: "num", aria: "5" },
  { id: "6", label: "6", variant: "num", aria: "6" },
  { id: "sub", label: "−", variant: "op", aria: "빼기" },

  { id: "1", label: "1", variant: "num", aria: "1" },
  { id: "2", label: "2", variant: "num", aria: "2" },
  { id: "3", label: "3", variant: "num", aria: "3" },
  { id: "add", label: "+", variant: "op", aria: "더하기" },

  { id: "neg", label: "+/-", variant: "fn", aria: "부호 바꾸기" },
  { id: "0", label: "0", variant: "num", aria: "0" },
  { id: "dot", label: ".", variant: "num", aria: "소수점" },
  { id: "eq", label: "=", variant: "eq", aria: "계산" },
] as const;
