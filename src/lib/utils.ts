export const isInternalLink = (link: string, product: string): boolean => {
  if (link.startsWith('/') || link.startsWith('#')) {
    return true
  } else if (
    product === 'vault' &&
    (link.startsWith('https://vaultproject.io') ||
      link.startsWith('https://www.vaultproject.io'))
  ) {
    return true
  }

  return false
}

export const chunk = <T>(arr: T[], chunkSize = 1, cache: T[][] = []): T[][] => {
  const tmp = [...arr]
  if (chunkSize <= 0) return cache
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}
