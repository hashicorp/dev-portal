/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as MDX from '@mdx-js/react'
// import path from 'node:path'
// import { rimraf } from 'rimraf'
import { paragraphCustomAlerts } from '@hashicorp/remark-plugins'

import { MDXRemote } from '..'
import { serialize } from '../serialize'
import { SerializeOptions } from '../types'

describe('serialize', () => {
	test('minimal', async () => {
		const result = await renderStatic('foo **bar**')
		expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`)
	})

	test('with component', async () => {
		const result = await renderStatic('foo <Test name="test" />', {
			components: {
				Test: ({ name }) => React.createElement('span', null, `hello ${name}`),
			},
		})
		expect(result).toMatchInlineSnapshot(`"<p>foo <span>hello test</span></p>"`)
	})

	test('with options', async () => {
		const options = {
			mdxOptions: {
				remarkPlugins: [paragraphCustomAlerts],
			},
		}
		const result = await renderStatic('~> hello', options)
		expect(result).toMatchInlineSnapshot(
			`"<div class=\"alert alert-warning g-type-body\"><p>hello</p></div>"`
		)
		expect(options.mdxOptions.remarkPlugins.length).toBe(1)
	})

	test('with scope', async () => {
		const result = await renderStatic('<Test name={bar} />', {
			components: {
				Test: ({ name }: { name: string }) =>
					React.createElement('p', null, name),
			},
			scope: {
				bar: 'test',
			},
		})
		expect(result).toMatchInlineSnapshot(`"<p>test</p>"`)
	})

	test('with custom provider', async () => {
		const TestContext = React.createContext(null)

		const mdxSource = await serialize('<Test />')

		const result = ReactDOMServer.renderToStaticMarkup(
			<TestContext.Provider value="provider-value">
				<MDXRemote
					{...mdxSource}
					components={{
						Test: () => (
							<TestContext.Consumer>
								{(value) => <p>{value}</p>}
							</TestContext.Consumer>
						),
					}}
				/>
			</TestContext.Provider>
		)

		expect(result).toMatchInlineSnapshot(`"<p>provider-value</p>"`)
	})

	test('with MDXProvider providing custom components', async () => {
		const mdxSource = await serialize('<Test />')

		const result = ReactDOMServer.renderToStaticMarkup(
			<MDX.MDXProvider
				components={{
					Test: () => <p>Hello world</p>,
				}}
			>
				<MDXRemote {...mdxSource} />
			</MDX.MDXProvider>
		)

		expect(result).toMatchInlineSnapshot(`"<p>Hello world</p>"`)
	})

	test('supports component names with a .', async () => {
		const mdxSource = await serialize('<motion.p />')

		const result = ReactDOMServer.renderToStaticMarkup(
			<MDXRemote
				{...mdxSource}
				scope={{
					motion: { p: () => <p>Hello world</p> },
				}}
			/>
		)

		expect(result).toMatchInlineSnapshot(`"<p>Hello world</p>"`)
	})

	test('strips imports & exports', async () => {
		const result = await renderStatic(`import foo from 'bar'

foo **bar**

export const foo = 'bar'`)
		expect(result).toMatchInlineSnapshot(`"<p>foo <strong>bar</strong></p>"`)
	})

	test('supports target', async () => {
		const mdx = `import foo from 'bar'

foo **bar**

export const foo = 'bar'`

		const resultA = await serialize(mdx, { target: 'es5' })
		const resultB = await serialize(mdx)

		expect(resultA).not.toEqual(resultB)
	})

	test('fragments', async () => {
		const components = {
			Test: ({ content }) => content,
		}

		const result = await renderStatic(
			`<Test content={<>Rendering a fragment</>} />`,
			{ components }
		)
		expect(result).toMatchInlineSnapshot(`"Rendering a fragment"`)
	})
})

async function renderStatic(
	mdx: string,
	{
		components,
		scope,
		mdxOptions,
		target,
	}: {
		components?: Record<string, React.ComponentType<any>>
	} & SerializeOptions = {}
): Promise<string> {
	const mdxSource = await serialize(mdx, { mdxOptions, target })

	return ReactDOMServer.renderToStaticMarkup(
		<MDXRemote {...mdxSource} components={components} scope={scope} />
	)
}
