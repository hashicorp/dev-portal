import boundaryLight from '@hashicorp/web-mktg-logos/src/boundary/boundary/boundary_on-light.svg'
import consulLight from '@hashicorp/web-mktg-logos/src/consul/consul/consul_on-light.svg'
import nomadLight from '@hashicorp/web-mktg-logos/src/nomad/nomad/nomad_on-light.svg'
import packerLight from '@hashicorp/web-mktg-logos/src/packer/packer/packer_on-light.svg'
import terraformLight from '@hashicorp/web-mktg-logos/src/terraform/terraform/terraform_on-light.svg'
import vagrantLight from '@hashicorp/web-mktg-logos/src/vagrant/vagrant/vagrant_on-light.svg'
import vaultLight from '@hashicorp/web-mktg-logos/src/vault/vault/vault_on-light.svg'
import waypointLight from '@hashicorp/web-mktg-logos/src/waypoint/waypoint/waypoint_on-light.svg'

import boundaryDark from '@hashicorp/web-mktg-logos/src/boundary/boundary/boundary_on-dark.svg'
import consulDark from '@hashicorp/web-mktg-logos/src/consul/consul/consul_on-dark.svg'
import nomadDark from '@hashicorp/web-mktg-logos/src/nomad/nomad/nomad_on-dark.svg'
import packerDark from '@hashicorp/web-mktg-logos/src/packer/packer/packer_on-dark.svg'
import terraformDark from '@hashicorp/web-mktg-logos/src/terraform/terraform/terraform_on-dark.svg'
import vagrantDark from '@hashicorp/web-mktg-logos/src/vagrant/vagrant/vagrant_on-dark.svg'
import vaultDark from '@hashicorp/web-mktg-logos/src/vault/vault/vault_on-dark.svg'
import waypointDark from '@hashicorp/web-mktg-logos/src/waypoint/waypoint/waypoint_on-dark.svg'

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
		return PRODUCT_LOGOS[normalizedProductName][theme]
	}

	return undefined
}