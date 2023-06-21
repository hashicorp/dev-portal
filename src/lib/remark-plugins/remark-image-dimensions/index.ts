import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return function transformer(tree) {
		visit(tree, 'jsx', (node: any) => {
			console.log(node.value)
			// use regex to capture the src

			const srcRegex = /src={{[\r\n]*\s*dark:.*[\r\n]*\s*light:.*[\r\n]*\s*}}/
			const match = node.value.match(srcRegex)

			// console.log('<MATCH', match)
			// coerce to string, trim all whitespace
			const src = String(match[0])
			// clean up string, trim whitespace, remove surrounding JSX syntax
			const cleanString = src.replaceAll(/src={{|}}|'|"|[\r\n\s]*/g, '')

			// target dark / light src directly
			// trim off the string
			const srcSetObj = Object.fromEntries(
				cleanString.split(',').map((src: string) => src.split(':'))
			)

			console.log(srcSetObj)

			// use regex to capture the width / height

			// get all the right props

			// recompose as a new string
		})
	}
}

export default remarkPluginCalculateImageDimensions
