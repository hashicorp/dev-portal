import type { Root } from 'mdast'
import type { JSX } from 'remark-mdx'
import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import probe from 'probe-image-size'

import { getNewImageUrl } from '../rewrite-static-assets'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree: Root) {
		const themedImageNodes = []

		visit(tree, 'jsx', (node: JSX) => {
			if (node.value.includes('ThemedImage')) {
				themedImageNodes.push(node)
			}
		})

		for (const node of themedImageNodes) {
			// use regex to capture the src
			const srcRegex =
				/src={{[\r\n]*\s*(dark:.*[\r\n]*\s*|light:.*[\r\n]*\s*)+}}/
			const match = node.value.match(srcRegex)
			const src = match?.length > 0 ? String(match[0]) : null
			let value = node.value
			let dimensions

			// We assume the first item in the array is the full match string
			// If it doesn't exist, skip
			if (!src) {
				console.log(
					'[remarkPluginCalculateImageDimensions]: No srcSet found on ThemedImage '
				)
				continue
			}

			// clean up string, trim whitespace, remove surrounding JSX syntax
			const cleanString = src.replaceAll(/src={{|}}|'|"|[\r\n\s]*/g, '')

			// Turn the light / dark src strings into an object
			const rawSrcSet = Object.fromEntries(
				cleanString.split(',').map((src: string) => src.split(':'))
			)

			// get the correct image paths for mktg-content-api or local asset server
			const srcSet = {
				dark: getNewImageUrl(rawSrcSet.dark),
				light: getNewImageUrl(rawSrcSet.light),
			}

			// update src definitions in the string
			value = value.replace(/dark:\s*('|").*('|")/, `dark: '${srcSet.dark}'`)
			value = value.replace(/light:\s*('|").*('|")/, `light: '${srcSet.light}'`)

			try {
				// TODO check if its a url that can be 'fetched'
				dimensions = await probe(srcSet.dark)
				const widthAndHeightDefined =
					value.includes('width') && value.includes('height')

				// only overwrite width and height if not defined
				if (!widthAndHeightDefined && dimensions) {
					const closingTagIndex = value.indexOf('/>')
					const withoutClosingTag = value.slice(0, closingTagIndex)
					// insert width / height before closing tag
					const strWithWidthAndHeight = withoutClosingTag.concat(
						`\n${`width='${dimensions.width}'`}\n${`height='${dimensions.height}'`}\n/>`
					)
					value = strWithWidthAndHeight
				}
			} catch (e) {
				// @TODO throw error if not 404 here?
				if (e.statusCode === 404) {
					console.error(
						'[remarkPluginCalculateImageDimensions] Image path not found, unable to calculate dimensions ' +
							e
					)
					node.value = value
				} else {
					throw e
				}
			}

			node.value = value
		}
	}
}

export default remarkPluginCalculateImageDimensions
