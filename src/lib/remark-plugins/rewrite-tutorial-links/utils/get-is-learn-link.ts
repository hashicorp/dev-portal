import { ProductOption, SectionOption } from 'lib/learn-client/types'

const learnHostname = 'learn.hashicorp.com'
const productAndSectionOptions = [
	...Object.keys(ProductOption),
	...Object.keys(SectionOption),
	'cloud',
]

/**
 * Determine whether the given `link` is a URL referencing Learn content.
 */
const getIsLearnLink = (link: string): boolean => {
	/**
	 * If `link` is falsy, it's can't be a Learn link.
	 */
	if (!link) {
		return false
	}

	/**
	 * Construct a URL object to analyze the link parts.
	 */
	const urlObject = new URL(link, `https://${learnHostname}`)
	const urlAsString = urlObject.toString()
	const { hostname, pathname } = urlObject
	const pathnameParts = pathname.split('/').slice(1)
	const numPathnameParts = pathnameParts.length
	const [basePath, productOrSectionSlug] = pathnameParts

	/**
	 * If the `base` argument passed to the URL constructor wasn't taken, then the
	 * link already has one and it is external to Learn.
	 */
	if (hostname !== learnHostname) {
		return false
	}

	/**
	 * Return true if the link is `https://learn.hashicorp.com` with or without a
	 * trailing slash.
	 */
	if (link === urlAsString || `${link}/` === urlAsString) {
		return true
	}

	/**
	 * If there is only one part to the pathname, check if it is an allowed slug
	 * for a product hub page.
	 */
	if (numPathnameParts === 1) {
		return (
			basePath !== 'onboarding' && productAndSectionOptions.includes(basePath)
		)
	}

	/**
	 * If it's not a product hub page, then check if it conforms to these formats:
	 *  - /collections/product/some-path
	 *  - /tutorials/product/some-path
	 */
	if (numPathnameParts !== 3) {
		return false
	}

	/**
	 * Return if the base path is something other than collections or tutorials.
	 */
	if (basePath !== 'collections' && basePath !== 'tutorials') {
		return false
	}

	/**
	 * Return whether or not the path part after `basePath` is one of the allowed
	 * product or section options.
	 */
	return productAndSectionOptions.includes(productOrSectionSlug)
}

export { getIsLearnLink }
