import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

import { getNewImageUrl } from '../rewrite-static-assets'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return function transformer(tree) {
		visit(tree, 'jsx', (node: any) => {
			// FRIST TEST IF IT IS THEMEDIMAGE

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

			console.log({ srcSet })

			// capture the width / height

			// check if width is defined

			// if so, use that

			// otherwise get the dimensions

			let value = node.value

			value = value.replace(/dark:\s*'|"[a-b]*'|"/, `dark: '${srcSet.dark}'`)
			value = value.replace(/light:\s*'|"[a-b]*'|"/, `light: '${srcSet.light}'`)
			console.log('FINALLLLL', value, node.value)
		})
	}
}

export default remarkPluginCalculateImageDimensions
