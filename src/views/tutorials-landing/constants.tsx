import { ProductSlug } from 'types/products'
import bookmarkIcon from './img/bookmark-add-custom.svg?include'
import playIcon from './img/play-custom.svg?include'
import terminalScreenIcon from './img/terminal-screen-custom.svg?include'

/**
 * General page-level constants
 */

const PAGE_TITLE = 'Start here'

// Used in page preamble AND for og:description
const PAGE_SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'

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
	terraform: 'Build, change, and destroy infrastructure',
	packer: 'Automate creating machine images',
	consul: 'Manage secure network connectivity',
	vault: 'Secure, store, and tightly control access to secrets',
	boundary: 'Manage identity-based access',
	nomad: 'Schedule and orchestrate workloads',
	waypoint: 'Publish any application to any platform',
	vagrant: 'Build and manage virtual machine environments',
}

/**
 * ContentTypesSection constants
 */

const CONTENT_TYPES_SECTION_TITLE =
	'Jump start your learning how/why statement that leads to our tutorial library'

const CONTENT_TYPES_SECTION_ITEMS = [
	{
		icon: playIcon,
		title: 'Byte-sized video demonstrations',
		description:
			'Each video lecture is about 5 minutes long and led by HashiCorp engineers',
	},
	{
		icon: terminalScreenIcon,
		title: 'Hands-on labs & study guides',
		description:
			'Practice your recently learned skills with our in-browser development environment',
	},
	{
		icon: bookmarkIcon,
		title: 'Bookmark and track your path',
		description:
			'Meeting you where you’re most familiar with for smooth product adoption',
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
