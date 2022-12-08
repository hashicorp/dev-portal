/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EnrichedIntegration = {
	id: string
	created_at: string
	updated_at: string
	slug: string
	name: string | null
	description: string | null
	license_type: string | null
	license_url: string | null
	external_only: boolean
	external_url: string | null
	tier: EnrichedIntegration.tier
	repo_url: string | null
	subdirectory: string | null
	hide_versions: boolean
	product: {
		id: string
		created_at: string
		updated_at: string
		slug: string
		name: string
	}
	organization: {
		id: string
		created_at: string
		updated_at: string
		slug: string
	}
	flags: Array<{
		id: string
		created_at: string
		updated_at: string
		slug: string
		name: string
		description: string
	}>
	versions: Array<string>
	components: Array<{
		id: string
		slug: string
		name: string
		plural_name: string
	}>
}

export namespace EnrichedIntegration {
	export enum tier {
		OFFICIAL = 'official',
		PARTNER = 'partner',
		COMMUNITY = 'community',
	}
}
