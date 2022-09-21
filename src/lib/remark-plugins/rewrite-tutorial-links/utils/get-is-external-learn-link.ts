import { ProductOption, SectionOption } from 'lib/learn-client/types'

const learnHostname = 'learn.hashicorp.com'
const productAndSectionOptions = [
	...Object.keys(ProductOption),
	...Object.keys(SectionOption),
	'cloud',
]

/**
 * Determines whether or not the given `linkOrPath` is a rewriteable link under
 * the learn.hashicorp.com hostname.
 */
const getIsExternalLearnLink = (link: string) => {
	try {
		const urlObject = new URL(link, `https://${learnHostname}`)
		const { hostname } = urlObject

		/**
		 * If the `base` argument passed to the URL constructor wasn't taken, then
		 * the link already has one and it is external to Learn.
		 */
		if (hostname !== learnHostname) {
			return false
		}

		/**
		 * Return whether or not the pathname fits the Learn format.
		 */
		return getIsExternalLearnPath(link)
	} catch (e) {
		return false
	}
}

/**
 * Determine whether the given `link` is a URL referencing Learn content in the
 * context of the Learn platform.
 */
const getIsExternalLearnPath = (link: string): boolean => {
	/**
	 * If `path` is falsy, it's can't be a Learn path.
	 */
	if (!link) {
		return false
	}

	/**
	 * Split the given `path` into its parts, and consider whether or not there is
	 * a leading `/`.
	 */
	const urlObject = new URL(link, `https://${learnHostname}`)
	const { pathname } = urlObject
	const pathnameParts = pathname
		.split('/')
		.slice(pathname.startsWith('/') ? 1 : 0)
	const numPathnameParts = pathnameParts.length
	const [basePath, productOrSectionSlug] = pathnameParts

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

export { getIsExternalLearnLink, getIsExternalLearnPath }
