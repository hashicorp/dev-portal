/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

interface UseCurrentPathOptions {
	excludeHash?: boolean
	excludeSearch?: boolean
}

/**
 * Gets the current path similar to Next's router but optionally excludes the
 * hash and/or search portion of the path. Uses `window.location`.
 */
const useCurrentPath = (options: UseCurrentPathOptions = {}): string => {
	let path
	try {
		const router = useRouter()
		path = router.asPath
	} catch (err) {
		path = usePathname()
	}

	const { excludeHash = false, excludeSearch = false } = options
	const { hash, pathname, search } = new URL(
		path,
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
