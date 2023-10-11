/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import bookmarkIcon from './img/bookmark-add-custom.svg?include'
import playIcon from './img/play-custom.svg?include'
import terminalScreenIcon from './img/terminal-screen-custom.svg?include'

/**
 * General page-level constants
 */

const PAGE_TITLE = 'Learn HashiCorp products'

// Used in page preamble AND for og:description
const PAGE_SUBTITLE =
	'Start learning with step-by-step, hands-on, command-line tutorials, videos, and hosted terminal sessions. Actionable examples help you learn to provision, secure, connect, or run any application on any infrastructure.'

/**
 * ProductSection constants
 */

const PRODUCT_SECTIONS_ORDER_BY_SLUG: Exclude<
	ProductSlug,
	'hcp' | 'sentinel'
>[] = ['terraform', 'vault', 'consul', 'nomad', 'packer', 'boundary', 'vagrant']

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
		icon: playIcon,
		title: 'Byte-sized video demonstrations',
		description:
			'Build confidence and learn what is coming with short demo videos',
	},
	{
		icon: terminalScreenIcon,
		title: 'Hosted terminal environments',
		description:
			'Skip the prerequisites and try a tutorial from your browser window',
	},
	{
		icon: bookmarkIcon,
		title: 'Save your place, and your favorites',
		description:
			'Life can be busy. Create an account to bookmark tutorials and save your place',
	},
]

/**
 * BetterTogetherSection constants
 *
 * @TODO rename to match `CrossProductSection` name
 */

const BETTER_TOGETHER_SECTION_TITLE = 'Use HashiCorp products together'

export {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_SECTIONS_ORDER_BY_SLUG,
	PRODUCT_DESCRIPTIONS,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
}
