import Decimal from "decimal.js";

/**
 * Single, app-wide Decimal configuration.
 *
 * - generous precision so chained operations stay accurate
 * - HALF_UP rounding matches what people expect from a pocket calculator
 * - plain notation for a wide range; extreme magnitudes fall back to exponent
 */
Decimal.set({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -12,
  toExpPos: 21,
});

export default Decimal;
