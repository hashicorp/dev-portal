/**
 * Determines if the given value is a boolean.
 */
module.exports = (value) => {
  return typeof value === 'boolean' || value instanceof Boolean
}
