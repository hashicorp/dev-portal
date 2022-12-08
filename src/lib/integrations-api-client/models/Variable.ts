/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Variable = {
	id: string
	created_at: string
	updated_at: string
	variable_group_id: string
	key: string
	description: string | null
	type: string | null
	required: boolean | null
	default_value: string | null
}
