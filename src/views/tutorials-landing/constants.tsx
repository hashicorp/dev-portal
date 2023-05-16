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

const PAGE_TITLE = 'Start here'

const PAGE_SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'

const PRODUCT_DESCRIPTIONS = {
	terraform: 'Build, change, and destroy infrastructure',
	packer: 'Automate creating machine images',
	consul: 'Manage secure network connectivity',
	vault: 'Secure, store, and tightly control access to secrets',
	boundary: 'Manage identity-based access',
	nomad: 'Schedule and orchestrate workloads',
	waypoint: 'Publish any application to any platform',
	vagrant: 'Build and manage virtual machine environments',
}

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

export { PAGE_TITLE, PAGE_SUBTITLE, PRODUCT_DESCRIPTIONS, BADGE_ICON_MAP }
