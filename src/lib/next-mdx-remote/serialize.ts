import mdx from '@mdx-js/mdx'
import { transform } from '@swc/core'
import remove from 'unist-util-remove'

// types
import { Plugin } from 'unified'
import { MDXRemoteSerializeResult, SerializeOptions } from './types'

/**
 * remark plugin which removes all import and export statements
 */
const removeImportsExportsPlugin: Plugin = () => (tree) =>
	//@ts-expect-error -- remove is a valid method
	remove(tree, ['import', 'export'])

/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */
export async function serialize(
	/** Raw MDX contents as a string. */
	source: string,
	{ scope = {}, mdxOptions = {}, target = 'es2020' }: SerializeOptions = {}
): Promise<MDXRemoteSerializeResult> {
	// don't modify the original object when adding our own plugin
	// this allows code to reuse the same options object
	const remarkPlugins = [
		...(mdxOptions.remarkPlugins || []),
		removeImportsExportsPlugin,
	]
	mdxOptions = {
		...mdxOptions,
		remarkPlugins,
	}

	const compiledMdx = await mdx(source, { ...mdxOptions, skipExport: true })
	const transformResult = await transform(compiledMdx, {
		minify: true,
		jsc: {
			parser: {
				syntax: 'ecmascript',
				jsx: true,
			},
			transform: {
				react: {
					pragma: 'mdx',
				},
			},
			target,
		},
	})

	return {
		compiledSource: transformResult.code,
		scope,
	}
}
