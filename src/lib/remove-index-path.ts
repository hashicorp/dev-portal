import { GetStaticPathsResult } from 'next'

type Paths = GetStaticPathsResult['paths']

/**
 * Given an array of path entries from getStaticPaths,
 * Return the paths with the index path filtered out.
 */
export function removeIndexPath(paths: Paths): Paths {
	return paths.filter((pathEntry) => {
		let isIndexPath = false
		if (typeof pathEntry == 'string') {
			isIndexPath = pathEntry == ''
		} else if (typeof pathEntry == 'object') {
			// the page array can be empty or contain a single empty string
			isIndexPath =
				pathEntry.params.page.length == 0 || pathEntry.params.page[0] == ''
		}

		return !isIndexPath
	})
}
