import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'

const nodeTypesToRegexes = {
	definition: /\[(?<linkText>[\s\S]*)\]: (?<linkUrl>.*)/,
	link: /\[(?<linkText>[\s\S]*)\]\((?<linkUrl>.*)\)/,
	linkReference: /\[(?<linkText>[\s\S]*)\]\[(?<linkUrl>.*)\]/,
	image: /!\[(?<imgAlt>[\s\S]*)\]\((?<imgSrc>.*)\)/,
}

const noPaddedNodes = lintRule('no-padded-nodes', (tree, file) => {
	const input = file.value
	visit(tree, Object.keys(nodeTypesToRegexes), (node) => {
		const {
			position: { start, end },
		} = node
		const nodeAsMdx = input.slice(start.offset, end.offset)
		const { groups } = nodeAsMdx.match(nodeTypesToRegexes[node.type])
		const hasSpacepadding = Object.keys(groups).some((captureGroup) => {
			const groupValue = groups[captureGroup]
			return groupValue.trim() !== groupValue
		})
		if (hasSpacepadding) {
			file.message(
				`Do not pad '${node.type}' nodes with spaces: "${nodeAsMdx}"`,
				node
			)
		}
	})
})

export default noPaddedNodes
