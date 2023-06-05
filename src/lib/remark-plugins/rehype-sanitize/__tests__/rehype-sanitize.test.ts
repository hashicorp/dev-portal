/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import { Plugin } from 'unified'
import type { Root, RootContent, Node } from 'hast'
import hastUtilToHtml from 'hast-util-to-html'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeSanitize, { schema } from '..'

/**
 * Note: `rehype-sanitize` includes significant test coverage
 * through `hast-util-sanitize`. Rather than replicate those tests,
 * this test file includes only a few test cases, to confirm our `schema` is valid.
 * https://github.com/syntax-tree/hast-util-sanitize/blob/main/test.js
 *
 * It's also worth noting we're usually ultimately rendering our markdown
 * with MDX, rather than going to HTML. So, we'd likely have a whole other
 * set of concerns related to `jsx` nodes... but thankfully `rehype-sanitize`
 * strips these by default, which works for use (for now). We also want to
 * test to confirm that `jsx` nodes are removed, as for now, without better
 * tooling to sanitize `jsx` nodes, we have to assume that any use of `jsx`
 * nodes could be malicious.
 */

describe('rehypeSanitize', () => {
	/**
	 * Note: removing JSX nodes handles the use of any and all "HTML" in source
	 * content. This is because when authors write "HTML" in markdown, really,
	 * since we're processing with MDX, they're writing JSX.
	 *
	 * Note as well that our other plugins, such as our "custom alerts" and our
	 * code syntax highlighting, modify the AST directly, and so end up adding
	 * HTML nodes rather than JSX nodes.
	 */
	it('removes JSX nodes', async () => {
		// Set up an MDX string with JSX nodes
		const mdxString = [
			'## Hello world!',
			'This is a paragraph node',
			"<div>{(() => console.info('Hacked! Oops.'))()}</div>",
			'<CustomComponent />',
			`<script type="text/javascript">{\`console.log('double pwned')\`}</script>`,
			`<button class="button" onclick="script:alert('pwned')">This is a nice README</button>`,
			`<a class="html" href="javascript:alert('triple pwned')">Just an innocuous link</a>`,
			`<style>{\`html {color: red; /* Style tags can allow for CSS injection, and XSS on certain browsers*/\`}}</style>`,
		].join('\n\n')
		// Serialize with `next-mdx-remote`, extracting the AST after sanitization
		const root = await getProcessedHast(mdxString)
		/**
		 * Assert that the AST we'll render does not have any JSX nodes
		 *
		 * Note: it'd be nice if there were type imports for `mdxhast`,
		 * similar to the type imports we're using for `hast`... Because the `hast`
		 * types are inaccurate (ie, `jsx` notes are possible)`, we use the more
		 * generic `Node` type here.
		 */
		const jsxNodes = root.children.filter((n: Node) => n.type === 'jsx')
		expect(jsxNodes.length).toBe(0)
		// Another backup assertion, if we filter out newlines, we should only
		// see two nodes: the heading node and paragraph node.
		const elementNodes = root.children.filter((n: RootContent) => {
			if ('value' in n) {
				return n.value !== '\n'
			} else {
				return true
			}
		})
		expect(elementNodes.length).toBe(2)
		const [firstNode, secondNode] = elementNodes
		expect('tagName' in firstNode && firstNode.tagName).toBe('h2')
		expect('tagName' in secondNode && secondNode.tagName).toBe('p')
	})

	it('renders malformed JSX nodes as plain text', async () => {
		// Set up an MDX string with JSX nodes
		const mdxString = [
			'## Hello again!',
			'This is another paragraph node',
			'<body/onload=alert(1)',
			'<svg/onload=alert(1)',
			'<iframe/onload=alert(1)',
			`Here's another paragraph after the malformed JSX`,
		].join('\n\n')
		// Serialize with `next-mdx-remote`, extracting the AST after sanitization
		const root = await getProcessedHast(mdxString)
		/**
		 * Assert that the AST we'll render does not have any JSX nodes
		 */
		const jsxNodes = root.children.filter((n: Node) => n.type === 'jsx')
		expect(jsxNodes.length).toBe(0)
		// Another backup assertion, if we filter out newlines, we should only
		// see two nodes: the heading node and paragraph node.
		const elementNodes = root.children.filter((n: RootContent) => {
			if ('value' in n) {
				return n.value !== '\n'
			} else {
				return true
			}
		})
		expect(elementNodes.length).toBe(6)
		const [firstNode, secondNode, thirdNode, fourthNode, fifthNode, sixthNode] =
			elementNodes
		expect('tagName' in firstNode && firstNode.tagName).toBe('h2')
		expect('tagName' in secondNode && secondNode.tagName).toBe('p')
		expect('tagName' in thirdNode && thirdNode.tagName).toBe('p')
		expect(
			'children' in thirdNode &&
				'value' in thirdNode.children[0] &&
				thirdNode.children[0].value
		).toBe('<body/onload=alert(1)')
		expect('tagName' in fourthNode && fourthNode.tagName).toBe('p')
		expect(
			'children' in fourthNode &&
				'value' in fourthNode.children[0] &&
				fourthNode.children[0].value
		).toBe('<svg/onload=alert(1)')
		expect('tagName' in fifthNode && fifthNode.tagName).toBe('p')
		expect(
			'children' in fifthNode &&
				'value' in fifthNode.children[0] &&
				fifthNode.children[0].value
		).toBe('<iframe/onload=alert(1)')
		expect('tagName' in sixthNode && sixthNode.tagName).toBe('p')
	})

	it('sanitizes malicious link URLs', async () => {
		// Set up an MDX string with a malicious URL
		const mdxString = [
			`[Click Here to Double Your RAM](javascript:window.onerror=alert(document.cookie))`,
		].join('\n\n')
		// Serialize with `next-mdx-remote`, extracting the AST after sanitization
		const root = await getProcessedHast(mdxString)
		// Assert that the AST we'll render does not have any JSX nodes
		const paragraphNode = root.children[0]
		if (!('children' in paragraphNode)) {
			fail('Paragraph node is expected to have a link element as a child.')
		}
		const linkNode = paragraphNode.children[0]
		if (!('properties' in linkNode)) {
			fail('Link node is expected to have properties.')
		}
		expect(linkNode.properties.href).toBe(undefined)
	})

	it('handles DOM purify test cases as expected', async () => {
		// Set up an MDX string with examples from https://cure53.de/purify
		const mdxString = fs.readFileSync(
			path.join(
				process.cwd(),
				'src/lib/remark-plugins/rehype-sanitize/__tests__/dompurify-fixtures.txt'
			),
			'utf8'
		)
		// Serialize with `next-mdx-remote`, extracting the AST after sanitization
		const root = await getProcessedHast(mdxString)
		// Grab the root HAST and stringify it to HTML, as it's easier to see
		// what's happening in this larger example. Note that we intentionally
		// allow dangerous characters and HTML, as if those are present in our
		// abstract syntax tree at this point, we want to detect them.
		const html = hastUtilToHtml(root, {
			allowDangerousCharacters: true,
			allowDangerousHtml: true,
		})
		// Assert that the AST matches an inline snapshot
		expect(html).toMatchSnapshot('rehype-sanitize-dom-purify-examples')
	})
})

/**
 * Utility to process a markdown string with `next-mdx-remote`,
 * returning the rehype syntax tree just after sanitization.
 */
async function getProcessedHast(mdxString: string): Promise<Root> {
	const extractedData: { hast?: Root } = {}
	await serialize(mdxString, {
		mdxOptions: {
			rehypePlugins: [
				[rehypeSanitize as Plugin, schema],
				[rehypeExtractHast, { extractedData }],
			],
		},
	})
	return extractedData.hast
}

/**
 * Utility to extract the rehype syntax tree, useful for asserting what we're
 * going to render via `next-mdx-remote` in a clearer way than trying to
 * assert on the serialized result.
 */
export default function rehypeExtractHast({
	extractedData,
}: {
	extractedData: Record<string, unknown>
}) {
	return function transformer(tree: Node): void {
		extractedData.hast = tree
	}
}
