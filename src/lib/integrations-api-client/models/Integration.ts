/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Integration = {
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
	tier: Integration.tier
	repo_url: string | null
	subdirectory: string | null
	hide_versions: boolean
	product_id: string
	organization_id: string
}

export namespace Integration {
	export enum tier {
		OFFICIAL = 'official',
		PARTNER = 'partner',
		COMMUNITY = 'community',
	}
}
