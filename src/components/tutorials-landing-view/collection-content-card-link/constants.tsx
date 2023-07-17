/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconBoundaryColor16 } from '@hashicorp/flight-icons/svg-react/boundary-color-16'
import { IconConsulColor16 } from '@hashicorp/flight-icons/svg-react/consul-color-16'
import { IconNomadColor16 } from '@hashicorp/flight-icons/svg-react/nomad-color-16'
import { IconPackerColor16 } from '@hashicorp/flight-icons/svg-react/packer-color-16'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { IconTerraformColor16 } from '@hashicorp/flight-icons/svg-react/terraform-color-16'
import { IconVagrantColor16 } from '@hashicorp/flight-icons/svg-react/vagrant-color-16'
import { IconVaultColor16 } from '@hashicorp/flight-icons/svg-react/vault-color-16'
import { IconWaypointColor16 } from '@hashicorp/flight-icons/svg-react/waypoint-color-16'
import boundaryGraphic from './img/boundary.svg'
import consulGraphic from './img/consul.svg'
import nomadGraphic from './img/nomad.svg'
import packerGraphic from './img/packer.svg'
import terraformGraphic from './img/terraform.svg'
import vagrantGraphic from './img/vagrant.svg'
import vaultGraphic from './img/vault.svg'
import waypointGraphic from './img/waypoint.svg'

const BADGE_ICON_MAP = {
	vault: {
		icon: <IconVaultColor16 />,
		label: 'Vault',
	},
	consul: {
		icon: <IconConsulColor16 />,
		label: 'Consul',
	},
	terraform: {
		icon: <IconTerraformColor16 />,
		label: 'Terraform',
	},
	nomad: {
		icon: <IconNomadColor16 />,
		label: 'Nomad',
	},
	boundary: {
		icon: <IconBoundaryColor16 />,
		label: 'Boundary',
	},
	packer: {
		icon: <IconPackerColor16 />,
		label: 'Packer',
	},
	vagrant: {
		icon: <IconVagrantColor16 />,
		label: 'Vagrant',
	},
	waypoint: {
		icon: <IconWaypointColor16 />,
		label: 'Waypoint',
	},
	video: {
		icon: <IconPlay16 />,
		label: 'Video',
	},
	interactive: {
		icon: <IconTerminalScreen16 />,
		label: 'Interactive',
	},
}

const PRODUCT_SLUGS_TO_HEADER_IMAGES = {
	boundary: boundaryGraphic,
	consul: consulGraphic,
	nomad: nomadGraphic,
	packer: packerGraphic,
	terraform: terraformGraphic,
	vagrant: vagrantGraphic,
	vault: vaultGraphic,
	waypoint: waypointGraphic,
}

export { BADGE_ICON_MAP, PRODUCT_SLUGS_TO_HEADER_IMAGES }
