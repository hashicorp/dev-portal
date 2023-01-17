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
 *
 * Note that when `hasFiltersApplied` is set to `true`, variables that are
 * direct matches (not unmatched ancestors) will be returned with a
 * `highlight: true` property.
 */
export function includeMatchAncestors(
	directMatches: Variable[],
	allVariables: Variable[],
	hasFiltersApplied: boolean
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
	 * Next we filter the original variables array, including any variable that
	 * matches any key (this will include direct matches).
	 *
	 * If a variable was a direct match, add `highlight: true`.
	 * Else, it's an ancestor variable, so we return but don't highlight.
	 */
	const directMatchKeys = directMatches.map((v: Variable) => v.key)
	const matchesAndAncestors = allVariables
		.filter((variable: Variable) => allKeysUnique.includes(variable.key))
		.map((variable: Variable) => {
			const isDirectMatch = directMatchKeys.includes(variable.key)
			if (isDirectMatch && hasFiltersApplied) {
				return { ...variable, highlight: true }
			} else {
				return variable
			}
		})

	/**
	 * Finally, we return our filtered variables,
	 */
	return matchesAndAncestors
}
