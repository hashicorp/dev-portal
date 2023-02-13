/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { Variable } from '../../variable-group-list'

/**
 * Given a `searchQuery` string, and an array of variables to filter,
 * Return a filtered array of variables.
 */
export function applyQueryFilter(
	searchQuery: string,
	variables: Array<Variable>
): Array<Variable> {
	return variables
		.filter((variable: Variable) => {
			return (
				variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
				variable.description?.toLowerCase().includes(searchQuery.toLowerCase())
			)
		})
		.map((variable: Variable) => ({ ...variable, highlight: true }))
}
