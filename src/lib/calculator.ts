import Decimal from "./decimal";

export type Operator = "+" | "-" | "×" | "÷";

export interface CalculatorState {
  /** exact numeric string being shown / typed, or "Error" */
  value: string;
  /** stored left-hand operand (exact string) */
  accumulator: string | null;
  operator: Operator | null;
  /** next digit starts a fresh value */
  overwrite: boolean;
  /** remembered op/operand so repeated "=" keeps applying */
  lastOperator: Operator | null;
  lastOperand: string | null;
  /** memory register, "0" when empty */
  memory: string;
  /** text for the small line above the number, e.g. "12 + 3 =" */
  expression: string;
  error: boolean;
}

export const initialState: CalculatorState = {
  value: "0",
  accumulator: null,
  operator: null,
  overwrite: true,
  lastOperator: null,
  lastOperand: null,
  memory: "0",
  expression: "",
  error: false,
};

export type CalculatorAction =
  | { type: "digit"; digit: string }
  | { type: "decimal" }
  | { type: "operator"; operator: Operator }
  | { type: "equals" }
  | { type: "negate" }
  | { type: "percent" }
  | { type: "backspace" }
  | { type: "clear" }
  | { type: "memoryClear" }
  | { type: "memoryRecall" }
  | { type: "memoryAdd" }
  | { type: "memorySubtract" }
  | { type: "hydrate"; state: Partial<CalculatorState> };

/** max digits a user can type into one operand */
const MAX_INPUT = 16;

/** round a computed result to a sane display precision, keep it as a string */
function toExact(d: Decimal): string {
  return d.toSignificantDigits(14).toString();
}

interface ComputeResult {
  value: string;
  error: boolean;
}

function compute(a: string, op: Operator, b: string): ComputeResult {
  try {
    const x = new Decimal(a || "0");
    const y = new Decimal(b || "0");
    let r: Decimal;
    switch (op) {
      case "+":
        r = x.plus(y);
        break;
      case "-":
        r = x.minus(y);
        break;
      case "×":
        r = x.times(y);
        break;
      case "÷":
        if (y.isZero()) return { value: "Error", error: true };
        r = x.dividedBy(y);
        break;
      default:
        return { value: "Error", error: true };
    }
    if (!r.isFinite()) return { value: "Error", error: true };
    return { value: toExact(r), error: false };
  } catch {
    return { value: "Error", error: true };
  }
}

function freshWith(memory: string, patch: Partial<CalculatorState>): CalculatorState {
  return { ...initialState, memory, ...patch };
}

export function reducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.state };

    case "clear":
      return freshWith(state.memory, {});

    case "digit": {
      const d = action.digit;
      if (state.error) {
        return freshWith(state.memory, {
          value: d,
          overwrite: false,
        });
      }
      if (state.overwrite) {
        return { ...state, value: d, overwrite: false };
      }
      if (state.value === "0") {
        return { ...state, value: d };
      }
      if (state.value === "-0") {
        return { ...state, value: d === "0" ? "-0" : "-" + d };
      }
      const digitCount = state.value.replace(/[-.]/g, "").length;
      if (digitCount >= MAX_INPUT) return state;
      return { ...state, value: state.value + d };
    }

    case "decimal": {
      if (state.error) {
        return freshWith(state.memory, { value: "0.", overwrite: false });
      }
      if (state.overwrite) {
        return { ...state, value: "0.", overwrite: false };
      }
      if (state.value.includes(".")) return state;
      return { ...state, value: state.value + "." };
    }

    case "negate": {
      if (state.error) return state;
      if (state.value === "0" || state.value === "0.") return state;
      const value = state.value.startsWith("-")
        ? state.value.slice(1)
        : "-" + state.value;
      return { ...state, value };
    }

    case "percent": {
      if (state.error) return state;
      try {
        const cur = new Decimal(state.value || "0");
        const r =
          state.operator && state.accumulator != null
            ? new Decimal(state.accumulator).times(cur).dividedBy(100)
            : cur.dividedBy(100);
        if (!r.isFinite()) return { ...state, value: "Error", error: true };
        return { ...state, value: toExact(r), overwrite: true };
      } catch {
        return { ...state, value: "Error", error: true };
      }
    }

    case "backspace": {
      if (state.error) return freshWith(state.memory, {});
      if (state.overwrite) return state;
      let value = state.value.slice(0, -1);
      if (value === "" || value === "-") value = "0";
      return { ...state, value };
    }

    case "operator": {
      if (state.error) return state;

      // just swap the pending operator when no new number was entered
      if (state.operator && state.overwrite && state.accumulator != null) {
        return {
          ...state,
          operator: action.operator,
          expression: `${state.accumulator} ${action.operator}`,
        };
      }

      // chain: fold the pending operation first
      if (state.operator && state.accumulator != null) {
        const res = compute(state.accumulator, state.operator, state.value);
        if (res.error) {
          return freshWith(state.memory, {
            value: res.value,
            error: true,
            expression: "",
          });
        }
        return {
          ...state,
          value: res.value,
          accumulator: res.value,
          operator: action.operator,
          overwrite: true,
          lastOperator: null,
          lastOperand: null,
          expression: `${res.value} ${action.operator}`,
        };
      }

      return {
        ...state,
        accumulator: state.value,
        operator: action.operator,
        overwrite: true,
        lastOperator: null,
        lastOperand: null,
        expression: `${state.value} ${action.operator}`,
      };
    }

    case "equals": {
      if (state.error) return state;

      if (state.operator && state.accumulator != null) {
        const operand = state.value;
        const res = compute(state.accumulator, state.operator, operand);
        const expression = `${state.accumulator} ${state.operator} ${operand} =`;
        if (res.error) {
          return freshWith(state.memory, {
            value: res.value,
            error: true,
            expression,
          });
        }
        return {
          ...state,
          value: res.value,
          accumulator: null,
          operator: null,
          overwrite: true,
          lastOperator: state.operator,
          lastOperand: operand,
          expression,
        };
      }

      // repeated "=" — reapply the last op/operand
      if (state.lastOperator && state.lastOperand != null) {
        const res = compute(state.value, state.lastOperator, state.lastOperand);
        const expression = `${state.value} ${state.lastOperator} ${state.lastOperand} =`;
        if (res.error) {
          return freshWith(state.memory, {
            value: res.value,
            error: true,
            expression,
          });
        }
        return { ...state, value: res.value, overwrite: true, expression };
      }

      return state;
    }

    case "memoryClear":
      return { ...state, memory: "0" };

    case "memoryRecall":
      if (state.error) return state;
      return { ...state, value: state.memory, overwrite: true };

    case "memoryAdd": {
      if (state.error) return state;
      try {
        const m = new Decimal(state.memory).plus(new Decimal(state.value || "0"));
        return { ...state, memory: toExact(m), overwrite: true };
      } catch {
        return state;
      }
    }

    case "memorySubtract": {
      if (state.error) return state;
      try {
        const m = new Decimal(state.memory).minus(
          new Decimal(state.value || "0"),
        );
        return { ...state, memory: toExact(m), overwrite: true };
      } catch {
        return state;
      }
    }

    default:
      return state;
  }
}
