import Decimal from "./decimal";

const GROUP_RE = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Turn an exact numeric string (as stored in calculator state) into what the
 * LCD should show: thousands grouping, preserved "as typed" trailing dot/zeros,
 * and a graceful switch to exponent notation when a value is too wide.
 */
export function formatForDisplay(raw: string, grouping = true): string {
  if (raw == null || raw === "") return "0";
  if (raw === "Error") return "ERROR";
  if (raw === "-0" || raw === "-0.") return raw.endsWith(".") ? "0." : "0";

  // already in exponent form (from a previous computation)
  if (/[eE]/.test(raw)) {
    return normalizeExponent(raw);
  }

  const neg = raw.startsWith("-");
  const body = neg ? raw.slice(1) : raw;
  const hasDot = body.includes(".");
  const [intRaw = "0", frac = ""] = body.split(".");
  let int = intRaw === "" ? "0" : intRaw;

  const significantLen = (int.replace(/^0+/, "") || "0").length + frac.length;
  if (int.length > 18 || significantLen > 16) {
    try {
      return normalizeExponent(new Decimal(raw).toExponential(8));
    } catch {
      /* fall through to plain rendering */
    }
  }

  if (grouping && int.length > 3) {
    int = int.replace(GROUP_RE, ",");
  }

  return (neg ? "-" : "") + int + (hasDot ? "." + frac : "");
}

function normalizeExponent(s: string): string {
  return s.replace(/e\+?/i, "E");
}
