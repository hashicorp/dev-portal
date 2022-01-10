/**
 * Given a number, a minimum value, and a maximum value,
 * Return the minimum value if the number is less than the minimum,
 * or the maximum value if the number is greater than the maximum,
 * or the number itself if it is greater than the minimum or less than the maximum.
 */
export default function clamp(
  /** The number to clamp. */
  num: number,
  /** The minimum allowable value. */
  min: number,
  /** The maximum allowable value. */
  max: number
): number {
  return Math.min(Math.max(num, min), max)
}
