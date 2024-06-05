/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Pluggable, Settings } from 'unified'

export interface DataLoader {
	opts: DataLoaderOpts
	loadStaticPaths(ctx?: GetStaticPathsContext): Promise<$TSFixMe>
	loadStaticProps(ctx?: GetStaticPropsContext): Promise<$TSFixMe>
}

export interface DataLoaderOpts {
	product: string
	paramId?: string
	/**
	 * @note `mdxContentHook` is run before any remark / rehype plugins
	 *
	 * The first argument is the content of the mdx file, minus any
	 * YAML frontmatter.
	 *
	 * The second argument is the `scope` object which contains additional
	 * data. The same `scope` made available to both remark and rehype plugins.
	 */
	mdxContentHook?: (
		mdxContent: string,
		scope: Record<string, unknown> | undefined
	) => string
}

export type RemarkPlugins =
	| ((params?: ParsedUrlQuery, version?: string) => Pluggable[])
	| Pluggable[]

export type RemarkPluginsArray = Pluggable<[Settings?], Settings>[]
