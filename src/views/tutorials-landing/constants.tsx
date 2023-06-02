import { ProductSlug } from 'types/products'

/**
 * General page-level constants
 */

const PAGE_TITLE = 'Learn HashiCorp products'

const PAGE_SUBTITLE =
	'Start learning with step-by-step, hands-on, command-line tutorials, videos, and hosted terminal sessions. Actionable examples help you learn to provision, secure, connect, or run any application on any infrastructure.'

/**
 * ProductSection constants
 */

const PRODUCT_SECTIONS_ORDER_BY_SLUG: Exclude<
	ProductSlug,
	'hcp' | 'sentinel'
>[] = [
	'terraform',
	'vault',
	'consul',
	'nomad',
	'packer',
	'boundary',
	'vagrant',
	'waypoint',
]

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
 *
 * @TODO rename to match `CrossProductSection` name
 */

const BETTER_TOGETHER_SECTION_TITLE =
	'Better together - Opportunity to elevate larger workflows'

export {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_SECTIONS_ORDER_BY_SLUG,
	PRODUCT_DESCRIPTIONS,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
}
