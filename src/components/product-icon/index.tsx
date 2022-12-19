import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconHcp16 } from '@hashicorp/flight-icons/svg-react/hcp-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'
import { ProductIconProps } from './types'

const productSlugsToIcons = {
	boundary: IconBoundaryColor16,
	consul: IconConsulColor16,
	hcp: IconHcp16,
	nomad: IconNomadColor16,
	packer: IconPackerColor16,
	sentinel: null,
	terraform: IconTerraformColor16,
	vagrant: IconVagrantColor16,
	vault: IconVaultColor16,
	waypoint: IconWaypointColor16,
}

const ProductIcon = ({ productSlug, ...rest }: ProductIconProps) => {
	const Icon = productSlugsToIcons[productSlug]
	if (!Icon) {
		return null
	}
	return <Icon {...rest} />
}

export type { ProductIconProps }
export default ProductIcon
