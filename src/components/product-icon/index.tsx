/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBoundary16 } from '@hashicorp/flight-icons/svg-react/boundary-16'
import { IconBoundary24 } from '@hashicorp/flight-icons/svg-react/boundary-24'
import { IconConsul16 } from '@hashicorp/flight-icons/svg-react/consul-16'
import { IconConsul24 } from '@hashicorp/flight-icons/svg-react/consul-24'
import { IconHcp16 } from '@hashicorp/flight-icons/svg-react/hcp-16'
import { IconHcp24 } from '@hashicorp/flight-icons/svg-react/hcp-24'
import { IconNomad16 } from '@hashicorp/flight-icons/svg-react/nomad-16'
import { IconNomad24 } from '@hashicorp/flight-icons/svg-react/nomad-24'
import { IconPacker16 } from '@hashicorp/flight-icons/svg-react/packer-16'
import { IconPacker24 } from '@hashicorp/flight-icons/svg-react/packer-24'
import { IconTerraform16 } from '@hashicorp/flight-icons/svg-react/terraform-16'
import { IconTerraform24 } from '@hashicorp/flight-icons/svg-react/terraform-24'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVagrantColor24 } from '@hashicorp/flight-icons/svg-react/vagrant-color-24'
import { IconVault16 } from '@hashicorp/flight-icons/svg-react/vault-16'
import { IconVault24 } from '@hashicorp/flight-icons/svg-react/vault-24'
import { IconVaultRadarSquareColor16 } from '@hashicorp/flight-icons/svg-react/vault-radar-square-color-16'
import { IconVaultRadarSquareColor24 } from '@hashicorp/flight-icons/svg-react/vault-radar-square-color-24'
import { IconVaultSecretsSquareColor16 } from '@hashicorp/flight-icons/svg-react/vault-secrets-square-color-16'
import { IconVaultSecretsSquareColor24 } from '@hashicorp/flight-icons/svg-react/vault-secrets-square-color-24'
import { IconWaypoint16 } from '@hashicorp/flight-icons/svg-react/waypoint-16'
import { IconWaypoint24 } from '@hashicorp/flight-icons/svg-react/waypoint-24'
import { ProductIconProps } from './types'

const productSlugsToIcons = {
	boundary: {
		16: IconBoundary16,
		24: IconBoundary24,
	},
	consul: {
		16: IconConsul16,
		24: IconConsul24,
	},
	hcp: {
		16: IconHcp16,
		24: IconHcp24,
	},
	nomad: {
		16: IconNomad16,
		24: IconNomad24,
	},
	packer: {
		16: IconPacker16,
		24: IconPacker24,
	},
	terraform: {
		16: IconTerraform16,
		24: IconTerraform24,
	},
	vagrant: {
		16: IconVagrantColor16,
		24: IconVagrantColor24,
	},
	vault: {
		16: IconVault16,
		24: IconVault24,
	},
	'hcp-vault-radar': {
		16: IconVaultRadarSquareColor16,
		24: IconVaultRadarSquareColor24,
	},
	'hcp-vault-secrets': {
		16: IconVaultSecretsSquareColor16,
		24: IconVaultSecretsSquareColor24,
	},
	waypoint: {
		16: IconWaypoint16,
		24: IconWaypoint24,
	},
	sentinel: {
		16: IconHcp16,
		24: IconHcp24,
	},
	'well-architected-framework': {
		16: IconHcp16,
		24: IconHcp24,
	},
}

const ProductIcon = ({
	productSlug,
	size = 16,
	...allRest
}: ProductIconProps) => {
	const Icon = productSlugsToIcons[productSlug]
		? productSlugsToIcons[productSlug][size]
		: null

	if (!Icon) {
		return null
	}

	// Filter out children and ref from rest props
	const { children, ref, ...rest } = allRest

	// Color should inherit from parent for hcp
	const color =
		productSlug === 'hcp' || productSlug === 'sentinel' || productSlug === 'well-architected-framework'
			? undefined
			: `var(--token-color-${productSlug}-brand)`

	/**
	 * The color is set here for theming purposes. We import the logo without
	 * color and then set the product brand color since all the product icons
	 * have a single fill color.
	 */
	return <Icon {...rest} color={color} />
}

ProductIcon.displayName = 'ProductIcon'

export type { ProductIconProps }
export default ProductIcon
