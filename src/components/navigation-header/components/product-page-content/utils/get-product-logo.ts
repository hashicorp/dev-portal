/**
 * Import the logos as raw inline SVG strings (via the `?include` loader
 * provided by @hashicorp/platform-nextjs-plugin). Inlining the markup means
 * the SVG is part of the React tree rather than an <img> src, so it is not
 * re-fetched or re-decoded on client-side navigation, which avoids the logo
 * flickering when navigating between links in the navigation bar.
 */
const boundaryLight = require('@hashicorp/web-mktg-logos/src/boundary/boundary/boundary_on-light.svg?include')
const consulLight = require('@hashicorp/web-mktg-logos/src/consul/consul/consul_on-light.svg?include')
const nomadLight = require('@hashicorp/web-mktg-logos/src/nomad/nomad/nomad_on-light.svg?include')
const packerLight = require('@hashicorp/web-mktg-logos/src/packer/packer/packer_on-light.svg?include')
const terraformLight = require('@hashicorp/web-mktg-logos/src/terraform/terraform/terraform_on-light.svg?include')
const vagrantLight = require('@hashicorp/web-mktg-logos/src/vagrant/vagrant/vagrant_on-light.svg?include')
const vaultLight = require('@hashicorp/web-mktg-logos/src/vault/vault/vault_on-light.svg?include')
const waypointLight = require('@hashicorp/web-mktg-logos/src/waypoint/waypoint/waypoint_on-light.svg?include')

const boundaryDark = require('@hashicorp/web-mktg-logos/src/boundary/boundary/boundary_on-dark.svg?include')
const consulDark = require('@hashicorp/web-mktg-logos/src/consul/consul/consul_on-dark.svg?include')
const nomadDark = require('@hashicorp/web-mktg-logos/src/nomad/nomad/nomad_on-dark.svg?include')
const packerDark = require('@hashicorp/web-mktg-logos/src/packer/packer/packer_on-dark.svg?include')
const terraformDark = require('@hashicorp/web-mktg-logos/src/terraform/terraform/terraform_on-dark.svg?include')
const vagrantDark = require('@hashicorp/web-mktg-logos/src/vagrant/vagrant/vagrant_on-dark.svg?include')
const vaultDark = require('@hashicorp/web-mktg-logos/src/vault/vault/vault_on-dark.svg?include')
const waypointDark = require('@hashicorp/web-mktg-logos/src/waypoint/waypoint/waypoint_on-dark.svg?include')

const PRODUCT_LOGOS = {
	boundary: {
		light: boundaryLight,
		dark: boundaryDark,
	},
	consul: {
		light: consulLight,
		dark: consulDark,
	},
	nomad: {
		light: nomadLight,
		dark: nomadDark,
	},
	packer: {
		light: packerLight,
		dark: packerDark,
	},
	terraform: {
		light: terraformLight,
		dark: terraformDark,
	},
	vagrant: {
		light: vagrantLight,
		dark: vagrantDark,
	},
	vault: {
		light: vaultLight,
		dark: vaultDark,
	},
	waypoint: {
		light: waypointLight,
		dark: waypointDark,
	},
} as const

export const getProductLogo = (
	productName: string,
	theme: string,
) => {
	const normalizedProductName = productName.trim().toLowerCase()
	if (normalizedProductName in PRODUCT_LOGOS) {
		const logo = PRODUCT_LOGOS[normalizedProductName][theme]
		return scopeSvgClassNames(logo, `${normalizedProductName}-${theme}`)
	}

	return undefined
}

/**
 * The marketing logo SVGs share the same internal class names (e.g. `.cls-1`)
 * across their light and dark variants, but with different fills. Because the
 * logos are inlined into the document (via @hashicorp/react-inline-svg), their
 * embedded <style> blocks are NOT scoped — they apply globally. When both
 * variants are rendered together, the later one's styles win for both,
 * resulting in the wrong colors being applied to the visible logo.
 *
 * To prevent this collision, we namespace every `cls-` token (used in both the
 * <style> selectors and the `class` attributes) with a per-variant prefix.
 */
function scopeSvgClassNames(svg: string, prefix: string): string {
	if (!svg) {
		return svg
	}
	return svg.replace(/cls-/g, `${prefix}-cls-`)
}
