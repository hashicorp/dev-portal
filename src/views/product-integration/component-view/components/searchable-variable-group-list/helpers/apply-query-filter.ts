import { Variable } from '../../variable-group-list'

/**
 * Given a `searchQuery` string, and an array of variables to filter,
 * Return a filtered array of variables.
 *
 * If `searchQuery` is 2 characters or longer, we'll filter the variables
 * for those that directly match the search query.
 *
 * Note: if `searchQuery` is fewer than 2 characters long,
 * the array of variables will be returned without any filtering applied.
 */
export function applyQueryFilter(
	searchQuery: string,
	variables: Array<Variable>
): Array<Variable> {
	// If the search query isn't long enough, return variables without filtering
	if (searchQuery.length < 2) {
		return variables
	}
	/**
	 * Otherwise, we want to filter for variables that match the query.
	 */
	const queryMatches = variables.filter((variable: Variable) => {
		return (
			variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
			variable.description?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	})
	return queryMatches
}
