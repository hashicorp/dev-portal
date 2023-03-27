/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBoundary16 } from '@hashicorp/flight-icons/svg-react/boundary-16'
import { IconConsul16 } from '@hashicorp/flight-icons/svg-react/consul-16'
import { IconHcp16 } from '@hashicorp/flight-icons/svg-react/hcp-16'
import { IconNomad16 } from '@hashicorp/flight-icons/svg-react/nomad-16'
import { IconPacker16 } from '@hashicorp/flight-icons/svg-react/packer-16'
import { IconTerraform16 } from '@hashicorp/flight-icons/svg-react/terraform-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVault16 } from '@hashicorp/flight-icons/svg-react/vault-16'
import { IconWaypoint16 } from '@hashicorp/flight-icons/svg-react/waypoint-16'
import { ProductIconProps } from './types'

const productSlugsToIcons = {
	boundary: IconBoundary16,
	consul: IconConsul16,
	hcp: IconHcp16,
	nomad: IconNomad16,
	packer: IconPacker16,
	sentinel: null,
	terraform: IconTerraform16,
	vagrant: IconVagrantColor16, // Vagrant's logo has 'shadows' so has to be 'color', also stays the same between themes
	vault: IconVault16,
	waypoint: IconWaypoint16,
}

const ProductIcon = ({ productSlug, ...rest }: ProductIconProps) => {
	const Icon = productSlugsToIcons[productSlug]
	// Color should inherit from parent for hcp
	const color =
		productSlug === 'hcp'
			? undefined
			: `var(--token-color-${productSlug}-brand)`

	if (!Icon) {
		return null
	}
	/**
	 * The color is set here for theming purposes. We import the logo without
	 * color and then set the product brand color since all the product icons
	 * have a single fill color.
	 */
	return <Icon {...rest} color={color} />
}

export type { ProductIconProps }
export default ProductIcon
