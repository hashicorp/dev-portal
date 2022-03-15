export default function getCSSVariableFromDocument(
  variableName: string,
  options: { asNumber?: boolean } = {}
): string | number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    variableName
  )

  if (options.asNumber) {
    return parseInt(value, 10)
  }

  return value
}
