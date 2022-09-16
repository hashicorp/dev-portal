import { productSlugsToHostNames } from 'lib/products'

const ACCEPTED_DOCS_PATHNAMES = [
	'docs',
	'api',
	'api-docs',
	'commands',
	'plugins',
	'tools',
	'vagrant-cloud',
	'intro',
	'cdktf',
	'cli',
	'cloud-docs',
	'enterprise',
	'internals',
	'language',
	'plugin',
	'registry',
]

const DOCS_LINK_REGEX = new RegExp(
	`(${Object.values(productSlugsToHostNames).join(
		'|'
	)})/(${ACCEPTED_DOCS_PATHNAMES.join('|')})`
)

/**
 * Determine whether the given `link` is a URL referencing product docs sites
 * that are external to the Learn platform.
 */
const getIsDocsLink = (link: string): boolean => {
	return DOCS_LINK_REGEX.test(link)
}

export { getIsDocsLink }
