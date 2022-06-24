/**
 * Determines if the given value is a string.
 */
module.exports = (value) => {
  return typeof value === 'string' || value instanceof String
}
