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

/**
 * General page-level constants
 */

const PAGE_TITLE = 'Learn HashiCorp products'

const PAGE_SUBTITLE =
	'Learn HashiCorp products with step-by-step, hands-on, command-line tutorials, videos, and hosted terminal sessions. Actionable examples help you learn how to provision, secure, connect, or run any application on any infrastructure.'

/**
 * ProductSection constants
 */

const PRODUCT_DESCRIPTIONS = {
	terraform: 'Provision and manage infrastructure',
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

/**
 * ContentTypesSection constants
 */

const CONTENT_TYPES_SECTION_TITLE =
	'Jump start your learning how/why statement that leads to our tutorial library'

const CONTENT_TYPES_SECTION_ITEMS = [
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Byte-sized video demonstrations',
		description:
			'Each video lecture is about 5 minutes long and led by HashiCorp engineers',
	},
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Hands-on labs & study guides',
		description:
			'Practice your recently learned skills with our in-browser development environment',
	},
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Bookmark and track your path',
		description:
			'Meeting you where you’re most familiar with for smooth product adoption',
	},
]

/**
 * BetterTogetherSection constants
 */

const BETTER_TOGETHER_SECTION_TITLE =
	'Better together - Opportunity to elevate larger workflows'

const BETTER_TOGETHER_SECTION_COLLECTION_SLUGS = [
	'well-architected-framework/com',
	'terraform/tutorials/hashicorp',
	'hcp/tutorials/consul-cloud',
]

export {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_DESCRIPTIONS,
	BADGE_ICON_MAP,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
	BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
}
