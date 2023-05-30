/**
 * General page-level constants
 */

const PAGE_TITLE = 'Start here'

const PAGE_SUBTITLE =
	'Brief intro - this is our opportunity to shape the value of this page for our Beginner practitioners. Max character count of 150 would be ideal.  Discover step-by-step learning paths to help you complete essential task to get started with HashiCorp products.'

/**
 * ProductSection constants
 */

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
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
	BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
}
