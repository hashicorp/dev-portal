/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { visit } from 'unist-util-visit'

const api = process.env.PLAYGROUND_API_URL

const remarkSentinel = () => (tree) => {
	visit(tree, 'code', (node) => {
		let example
		if (node.lang === 'sentinel') {
			if (!node.meta || !node.meta.includes('playground')) {
				return
			}
			example = {
				policy: node.value,
			}
		}
		if (node.lang === 'json' && node.meta && node.meta.includes('sentinel')) {
			example = JSON.parse(node.value)
		}
		let apiProp = ''
		if (api) {
			apiProp = `api={"${api}"}`
		}
		if (example) {
			node.type = 'jsx'
			node.value = `<SentinelEmbedded exampleData={${JSON.stringify(
				example
			)}} ${apiProp} />`
		}
	})
}

export default remarkSentinel
