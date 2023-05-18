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
	'Start learning with step-by-step, hands-on, command-line tutorials, videos, and hosted terminal sessions. Actionable examples help you learn to provision, secure, connect, or run any application on any infrastructure.'

/**
 * ProductSection constants
 */

const PRODUCT_DESCRIPTIONS = {
	terraform:
		'Provision and manage infrastructure using declarative, human-readable configuration files',
	packer:
		'Create machine images for multiple platforms automatically from one source configuration',
	consul:
		'Connect and secure services with mutual TLS, and automate network rules across clouds',
	vault:
		'Securely store, access, deploy, and rotate secrets. Encrypt data in flight and at rest',
	boundary:
		'Control access to critical systems with fine-grained, identity-based authorizations',
	nomad:
		'Deploy and manage containers and other applications on-premises and in the cloud at scale',
	waypoint:
		'Let teams without infrastructure knowledge ship applications using a PaaS-like interface',
	vagrant:
		'Build, manage, and share virtual machine environments with a single workflow',
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

const CONTENT_TYPES_SECTION_TITLE = 'Learn your way, at your own pace'

const CONTENT_TYPES_SECTION_ITEMS = [
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Byte-sized video demonstrations',
		description:
			'Build confidence and learn what is coming with short demo videos',
	},
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Hosted terminal environments',
		description:
			'Skip the prerequisites and try a tutorial from your browser window',
	},
	{
		imageSource: 'https://placekitten.com/g/70/70',
		title: 'Save your place, and your favorites',
		description:
			'Life can be busy. Bookmark a tutorial to save your place on your learning path',
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
