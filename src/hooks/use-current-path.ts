/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRouter } from 'next/router'

interface UseCurrentPathOptions {
	excludeHash?: boolean
	excludeSearch?: boolean
}

/**
 * Gets the current path similar to Next's router but optionally excludes the
 * hash and/or search portion of the path. Uses `window.location`.
 */
const useCurrentPath = (options: UseCurrentPathOptions = {}): string => {
	const router = useRouter()
	const { excludeHash = false, excludeSearch = false } = options
	const { hash, pathname, search } = new URL(
		router.asPath,
		// TODO: replace this with an environment variable soon
		'https://www.hashicorp.com'
	)

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
