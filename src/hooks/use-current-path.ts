interface UseCurrentPathOptions {
  excludeHash?: boolean
  excludeSearch?: boolean
}

/**
 * Gets the current path similar to Next's router but optionally excludes the
 * hash and/or search portion of the path. Uses `window.location`.
 */
const useCurrentPath = (options: UseCurrentPathOptions = {}): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  const { excludeHash = false, excludeSearch = false } = options
  const { hash, pathname, search } = window.location

  if (excludeHash && excludeSearch) {
    return pathname
  }

  if (excludeHash) {
    return pathname + search
  }

  if (excludeSearch) {
    return pathname + hash
  }

  return pathname + search + hash
}

export default useCurrentPath
