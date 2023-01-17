import { Variable } from '../../variable-group-list'

/**
 * Given a `requiredOnly` boolean, and an array of variables to filter,
 * Return a filtered array of variables.
 */
export function applyRequiredFilter(
	variables: Array<Variable>
): Array<Variable> {
	return variables.filter((variable: Variable) => variable.required === true)
}
