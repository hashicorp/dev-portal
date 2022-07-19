import { GetStaticPathsResult } from 'next'

type Paths = GetStaticPathsResult['paths']

/**
 * Given an array of path entries from getStaticPaths,
 * Return the paths with the index path filtered out.
 */
export function removeIndexPath(paths: Paths): Paths {
	return paths.filter((pathEntry) => {
		const isIndexPath =
			typeof pathEntry == 'string'
				? pathEntry == ''
				: pathEntry.params.page.length == 0
		return !isIndexPath
	})
}
