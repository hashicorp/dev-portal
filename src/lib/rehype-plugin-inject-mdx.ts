// import { visit } from 'unist-util-visit'
import { Plugin, Transformer } from 'unified'

const rehypePluginInjectMdx: Plugin = (): Transformer => {
	return function transformer(tree) {
		const nodesToAdd = [
			// {
			// 	type: 'element',
			// 	tagName: 'a',
			// 	properties: {
			// 		href: 'https://alpha.com',
			// 		className: ['bravo'],
			// 		download: true,
			// 	},
			// 	children: [],
			// },
			// {
			//   type: 'element',
			//   value: '<a class="__permalink-h" href="#http-api" aria-label="http api permalink">»</a>',
			//   children: [Array],
			//   tagName: 'a',
			//   properties: [Object]
			// },
			{
				type: 'element',
				tagName: 'h1',
				properties: { id: 'injected-heading' },
				children: [{ type: 'text', value: 'Some Added Content' }],
			},
			{ type: 'text', value: '\n' },
		]
		const newTree = {
			...tree,
			// @ts-expect-error TODO figure out tree.children typing
			children: [...nodesToAdd, ...tree.children],
		}
		return newTree
	}
}

export default rehypePluginInjectMdx
