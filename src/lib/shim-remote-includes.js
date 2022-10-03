import fetchContentApiFileString from './fetch-content-api-file-string'

// TODO need to be able to include from remote...
// TODO this is a terrible patch in the meantime
async function shimRemoteIncludes(
	mdxString,
	productSlug,
	version,
	partialsDir = 'website/content/partials'
) {
	return await replaceAsync(
		mdxString,
		/@include (?:"|')(.*)(?:"|')\n/g,
		async (match, matchedPath) => {
			const includeFileString = await fetchContentApiFileString({
				product: productSlug,
				filePath: `${partialsDir}/${matchedPath}`,
				version,
			})
			return `${includeFileString}\n`
		}
	)
}

/**
 * Given a string, regex, and async function,
 * Runs the regex replacement
 *
 * @param {string} str
 * @param {RegExp} regex
 * @param {*} asyncFn
 * @returns {Promise<string>}
 */
async function replaceAsync(str, regex, asyncFn) {
	const promises = []
	str.replace(regex, (match, ...args) => {
		const promise = asyncFn(match, ...args)
		promises.push(promise)
	})
	const data = await Promise.all(promises)
	return str.replace(regex, () => data.shift())
}

export default shimRemoteIncludes
