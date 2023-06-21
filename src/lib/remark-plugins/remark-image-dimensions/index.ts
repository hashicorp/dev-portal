import { Plugin, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

const remarkPluginCalculateImageDimensions: Plugin = (): Transformer => {
	return function transformer(tree) {
		visit(tree, 'jsx', (node: any) => {
			console.log(node.value)
			// use regex to capture the src

			const srcRegex = /{[\r\n]*\s*dark:.*[\r\n]*\s*light:.*[\r\n]*\s*}/
			const match = node.value.match(srcRegex)

			// console.log('<MATCH', match)
			// coerce to string, trim all whitespace
			const src = String(match[0]).replaceAll(/[\r\n\s]*/g, '')
			// target dark / light src directly

			const obj = JSON.parse(JSON.stringify(src))

			console.log(JSON.stringify(src))

			console.log(node.value.split(srcRegex))

			// use regex to capture the width / height

			// get all the right props

			// recompose as a new string
		})
	}
}

export default remarkPluginCalculateImageDimensions
