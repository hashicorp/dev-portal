import { Pluggable, Compiler } from 'unified'
import type { JscTarget } from '@swc/core'

export interface SerializeOptions {
	/**
	 * Pass-through variables for use in the MDX content
	 */
	scope?: Record<string, unknown>
	/**
	 * These options are passed to the MDX compiler.
	 * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
	 */
	mdxOptions?: {
		remarkPlugins?: Pluggable[]
		rehypePlugins?: Pluggable[]
		hastPlugins?: Pluggable[]
		compilers?: Compiler[]
		filepath?: string
	}
	/**
	 * Specify the target environment for the generated code.
	 * See the [swc docs](https://swc.rs/docs/configuration/compilation#jsctarget) for additional information on possible values.
	 */
	target?: JscTarget
}

/**
 * Represents the return value of a call to serialize()
 */
export type MDXRemoteSerializeResult<TScope = Record<string, unknown>> = {
	/**
	 * The compiledSource, generated from next-mdx-remote/serialize
	 */
	compiledSource: string
	/**
	 * An arbitrary object of data which will be supplied to the MDX.
	 *
	 * For example, in cases where you want to provide template variables to the MDX, like `my name is {name}`,
	 * you could provide scope as `{ name: "Some name" }`.
	 */
	scope?: TScope
}
