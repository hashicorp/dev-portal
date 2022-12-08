/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EnrichedIntegrationRelease = {
	id: string
	created_at: string
	updated_at: string
	integration_id: string
	version: string
	readme: string | null
	components: Array<{
		id: string
		created_at: string
		updated_at: string
		readme: string | null
		integration_release_id: string
		component: {
			id: string
			created_at: string
			updated_at: string
			slug: string
			name: string
			plural_name: string
			product_id: string
		}
		variable_groups: Array<{
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
		}>
	}>
}
