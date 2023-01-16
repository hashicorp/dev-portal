import { Variable } from '../../variable-group-list'

/**
 * Given a `requiredOnly` boolean, and an array of variables to filter,
 * Return a filtered array of variables.
 *
 * If `requiredOnly` is true, only required variables will be included.
 * Otherwise, variables will be returned without any filtering applied.
 */
export function applyVariableRequiredFilter(
	requiredOnly: boolean,
	variables: Array<Variable>
): Array<Variable> {
	// If the filter isn't being applied, return the variables unmodified
	if (requiredOnly !== true) {
		return variables
	}
	// Otherwise, return only required variables
	return variables.filter((variable: Variable) => variable.required === true)
}
