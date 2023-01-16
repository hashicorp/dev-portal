import { Variable } from '../../variable-group-list'

/**
 * Given a `searchQuery` string, and an array of variables to filter,
 * Return a filtered array of variables, as well as the count of direct
 * matches.
 *
 * If `searchQuery` is 2 characters or longer, we'll filter the variables
 * for those that directly match the search query. We also include any
 * parent objects that contain variable properties that are a direct match.
 * Since the returned array includes parent variables that may not be direct
 * matches, we return a number representing the count of direct matches,
 * as this represents the results count more accurately.
 *
 * Note: if `searchQuery` is fewer than 2 characters long,
 * the array of variables will be returned without any filtering applied.
 * We'll return the length of the unfiltered array as our match count.
 */
export function applyVariableQueryFilter(
	searchQuery: string,
	variables: Array<Variable>
): [Array<Variable>, number] {
	// If the search query isn't long enough, return variables without filtering
	if (searchQuery.length < 2) {
		return [variables, variables.length]
	}
	/**
	 * Otherwise, we want to filter for variables that match the query.
	 * First, we find all variables that directly match the provided query.
	 */
	const directMatches = variables.filter((variable: Variable) => {
		return (
			variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
			variable.description?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	})

	/**
	 * Note that some variables may be object properties, with parent variables.
	 * Even if parent variables aren't a direct match, we want to return them
	 * so that the structure of filtered variables is clear.
	 *
	 * The first step in finding all these parent variables is splitting
	 * up the key paths to any directly matched variables. Each unique key path
	 * represents a parent variable that we'll want to include.
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
	 * If a variable was a direct match, specify highlight as a prop.
	 * Else, it's a parent variable, so we return but don't highlight
	 */
	const directMatchKeys = directMatches.map((v: Variable) => v.key)
	const filteredResults = variables
		.filter((variable: Variable) => allKeysUnique.includes(variable.key))
		.map((variable: Variable) => {
			const isDirectMatch = directMatchKeys.includes(variable.key)
			return isDirectMatch ? { ...variable, highlight: true } : variable
		})

	/**
	 * Finally, we return our filtered variables,
	 * along with the count of direct matches.
	 */
	return [filteredResults, directMatches.length]
}
