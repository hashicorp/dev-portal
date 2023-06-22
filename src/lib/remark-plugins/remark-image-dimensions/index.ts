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
			const srcRegex = /src={{[\r\n]*\s*dark:.*[\r\n]*\s*light:.*[\r\n]*\s*}}/
			const match = node.value.match(srcRegex)
			const src = String(match[0])

			// We assume the first item in the array is the full match string
			// If it doesn't exist, skip
			if (!src) {
				continue
			}

			// clean up string, trim whitespace, remove surrounding JSX syntax
			const cleanString = src.replaceAll(/src={{|}}|'|"|[\r\n\s]*/g, '')

			// target dark / light src directly
			const rawSrcSet = Object.fromEntries(
				cleanString.split(',').map((src: string) => src.split(':'))
			)

			// define correct src values
			const srcSet = {
				dark: getNewImageUrl(rawSrcSet.dark),
				light: getNewImageUrl(rawSrcSet.light),
			}

			let value = node.value
			value = value.replace(/dark:\s*('|").*('|")/, `dark: '${srcSet.dark}'`)
			value = value.replace(/light:\s*('|").*('|")/, `light: '${srcSet.light}'`)

			let dimensions
			try {
				dimensions = await probe(srcSet.dark)

				// if width and height are passed, don't overwrite

				const widthAndHeightDefined =
					value.includes('width') && value.includes('height')

				if (!widthAndHeightDefined) {
					const closingTagIndex = value.indexOf('/>')
					const withoutClosingTag = value.slice(0, closingTagIndex)
					// insert width / height before closing tag
					const strWithWidthAndHeight = withoutClosingTag.concat(
						`\n${`width='${dimensions.width}'`}\n${`height='${dimensions.height}'`}\n/>`
					)
					value = strWithWidthAndHeight
				}
			} catch (e) {
				if (e.statusCode === 404) {
					console.error(
						'[remarkPluginCalculateImageDimensions] Image path not found, unable to calculate dimensions'
					)
				}

				node.value = value
			}

			node.value = value
		}
	}
}

export default remarkPluginCalculateImageDimensions
