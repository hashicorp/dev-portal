/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EnrichedVariableGroup = {
	id: string
	created_at: string
	updated_at: string
	integration_release_component_id: string
	variable_group_config: {
		id: string
		created_at: string
		updated_at: string
		product_id: string
		name: string
		filename: string
		stanza: string
		display_order: number
	}
	variables: Array<{
		id: string
		created_at: string
		updated_at: string
		variable_group_id: string
		key: string
		description: string | null
		type: string | null
		required: boolean | null
		default_value: string | null
	}>
}
