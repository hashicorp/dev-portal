import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import find from 'unist-util-find'
import probe from 'probe-image-size'

import { getNewImageUrl } from '../rewrite-static-assets'
import { Node } from 'unist'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return async function transformer(tree) {
		const themedImageNodes = []
		visit(tree, 'jsx', (node: any) => {
			// FRIST TEST IF IT IS THEMEDIMAGE
			themedImageNodes.push(node)
		})

		console.log('START', tree)

		for (const node of themedImageNodes) {
			console.log(node)
			// use regex to capture the src
			const srcRegex = /src={{[\r\n]*\s*dark:.*[\r\n]*\s*light:.*[\r\n]*\s*}}/
			const match = node.value.match(srcRegex)

			// console.log('<MATCH', match)
			// coerce to string, trim all whitespace
			const src = String(match[0])
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

			// console.log({ srcSet })

			// capture the width / height
			// do I use the dark width / height?
			// should I capture both?
			const dimensions = await probe(srcSet.dark)

			let value = node.value

			value = value.replace(/dark:\s*('|").*('|")/, `dark: '${srcSet.dark}'`)
			value = value.replace(/light:\s*('|").*('|")/, `light: '${srcSet.light}'`)
			value = value.replaceAll(
				/width=\s*('|").*('|")/g,
				`width='${dimensions.width}'`
			)
			value = value.replaceAll(
				/height=\s*('|").*('|")/g,
				`height='${dimensions.height}'`
			)
			console.log('FINALLLLL', value)

			node.value = value
		}

		return tree
	}
}

export default remarkPluginCalculateImageDimensions
