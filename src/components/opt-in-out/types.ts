export enum PlatformOptionTitles {
	'boundary-io' = 'Boundary',
	'consul-io' = 'Consul',
	'hcp-io' = 'HashiCorp Cloud Platform',
	'nomad-io' = 'Nomad',
	'packer-io' = 'Packer',
	'sentinel-io' = 'Sentinel',
	'terraform-io' = 'Terraform',
	'vault-io' = 'Vault',
	'vagrant-io' = 'Vagrant',
	'waypoint-io' = 'Waypoint',
	learn = 'Learn',
}

export type OptInPlatformOption = keyof typeof PlatformOptionTitles

/**
 * Type guard to determine if a string is an OptInPlatformOption
 */
export function isOptInPlatformOption(
	string: string
): string is OptInPlatformOption {
	return Object.keys(PlatformOptionTitles).includes(
		string as OptInPlatformOption
	)
}
export interface OptInOutProps {
	platform: OptInPlatformOption
	redirectPath?: string
}

export interface RedirectData {
	base_url: string
	getRedirectPath: (currentPath?: string) => string
	cookieKey: string
	cookieAnalyticsKey: string
}

export type PlatformOptionRedirectData = Record<
	OptInPlatformOption,
	RedirectData
>
