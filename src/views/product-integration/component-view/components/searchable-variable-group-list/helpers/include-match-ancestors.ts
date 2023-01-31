import { Variable } from '../../variable-group-list'

/**
 * Given an array of variables, representing a full unfiltered list,
 * and an array of variables representing direct matches to applied filters,
 *
 * Return an array of variables that includes both the provided direct matches,
 * as well as any ancestor variables of any of those direct matches.
 *
 * Ancestor variables are variables that match the partial key path parts
 * of any direct match.
 */
export function includeMatchAncestors(
	directMatches: Variable[],
	allVariables: Variable[]
): Variable[] {
	/**
	 * Note that some variables may be object properties, with parent variables.
	 * Even if parent variables aren't a direct match, we want to return them
	 * so that the structure of filtered variables is clear. Matches may also be
	 * deeply nested, so we're looking for all ancestors, not only direct parents.
	 *
	 * The first step in finding all these ancestor variables is splitting
	 * up the key paths to any directly matched variables. Each unique key path
	 * represents an ancestor variable that we'll want to include.
	 */
	const allKeys = []
	directMatches
		.map((variable: Variable) => variable.key)
		.forEach((matchedKey: string) => {
			const segments = matchedKey.split('.')
			segments.forEach((_segment: string, i: number) => {
				allKeys.push(
					matchedKey
						.split('.')
						.slice(0, i + 1)
						.join('.')
				)
			})
		})
	const allKeysUnique = Array.from(new Set(allKeys))

	/**
	 * Next we find ancestor keys only, as we want to preserve the provided
	 * directMatches array in our return value.
	 *
	 * We filter out allKeys to remove any directMatchKeys, giving us only
	 * ancestor variable keys. Then we filter allVariables for ancestor variables.
	 */
	const directMatchKeys = directMatches.map((v: Variable) => v.key)
	const ancestorKeys = allKeysUnique.filter(
		(k: string) => !directMatchKeys.includes(k)
	)
	const ancestorVariables = allVariables.filter((variable: Variable) =>
		ancestorKeys.includes(variable.key)
	)

	// Finally, we return our combined directMatches and ancestorVariables
	return [...directMatches, ...ancestorVariables]
}
