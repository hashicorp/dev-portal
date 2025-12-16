/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { FlightIconName } from '@hashicorp/mds-react/components'
import boundaryGraphic from './img/boundary.svg'
import consulGraphic from './img/consul.svg'
import nomadGraphic from './img/nomad.svg'
import packerGraphic from './img/packer.svg'
import terraformGraphic from './img/terraform.svg'
import vagrantGraphic from './img/vagrant.svg'
import vaultGraphic from './img/vault.svg'
import waypointGraphic from './img/waypoint.svg'

const BADGE_ICON_MAP: Record<string, {icon: FlightIconName, label: string}> = {
	vault: {
		icon: 'vault-color',
		label: 'Vault',
	},
	consul: {
		icon: 'consul-color',
		label: 'Consul',
	},
	terraform: {
		icon: 'terraform-color',
		label: 'Terraform',
	},
	nomad: {
		icon: 'nomad-color',
		label: 'Nomad',
	},
	boundary: {
		icon: 'boundary-color',
		label: 'Boundary',
	},
	packer: {
		icon: 'packer-color',
		label: 'Packer',
	},
	vagrant: {
		icon: 'vagrant-color',
		label: 'Vagrant',
	},
	waypoint: {
		icon: 'waypoint-color',
		label: 'Waypoint',
	},
	video: {
		icon: 'play',
		label: 'Video',
	},
	interactive: {
		icon: 'terminal-screen',
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
