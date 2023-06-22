import probe from 'probe-image-size'
import { getNewImageUrl } from '../rewrite-static-assets'
import { PATTERNS } from '.'

export async function getDimensions(src: string) {
	let dimensions

	// get dimensions
	try {
		// TODO check if its a url that can be 'fetched'
		// IOW handle the case for /img/...
		dimensions = await probe(src)
	} catch (e) {
		if (e.statusCode === 404) {
			console.error(
				'[remarkPluginCalculateImageDimensions] Image path not found, unable to calculate dimensions ' +
					e
			)
		} else {
			throw e
		}
	}

	return dimensions
}

export function getSrcSetWithUpdatedPaths(src: string): {
	dark: string
	light: string
} {
	// clean up string, trim whitespace, remove surrounding JSX syntax
	const cleanString = src.replaceAll(PATTERNS.jsxAndWhitespace, '')
	// Turn the light / dark src strings into an object
	const rawSrcSet = Object.fromEntries(
		cleanString.split(',').map((src: string) => src.split(':'))
	)
	// get the correct image paths for mktg-content-api or local asset server
	return {
		dark: getNewImageUrl(rawSrcSet.dark),
		light: getNewImageUrl(rawSrcSet.light),
	}
}

export function concatWithWidthAndHeight(
	srcString: string,
	dimensions: { width: string; height: string }
): string {
	// isolate the src string contents before the closing tag
	const withoutClosingTag = srcString.slice(0, srcString.indexOf('/>'))
	// insert width / height before closing tag
	return withoutClosingTag.concat(
		`\n${`width='${dimensions.width}'`}\n${`height='${dimensions.height}'`}\n/>`
	)
}
