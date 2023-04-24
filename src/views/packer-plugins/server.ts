/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import grayMatter from 'gray-matter'
import { Pluggable } from 'unified'
import { ProductData } from 'types/products'
import { getNodeFromPath, getPathsFromNavData } from '../docs-view/loaders'
import renderPageMdx from 'views/docs-view/render-page-mdx'
import remarkPluginAdjustLinkUrls from 'lib/remark-plugins/remark-plugin-adjust-link-urls'
import { getProductUrlAdjuster } from 'views/docs-view/utils/product-url-adjusters'
import resolveNavDataWithRemotePlugins, {
	appendRemotePluginsNavData,
} from './utils/resolve-nav-data'
import fetchLatestReleaseTag from './utils/fetch-latest-release-tag'
// packer product data
import packerProductData from 'data/packer.json'
// remark plugins
import {
	// includeMarkdown,
	paragraphCustomAlerts,
	typography,
	anchorLinks,
} from '@hashicorp/remark-plugins'
// rehype plugins
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import rehypePrism from '@mapbox/rehype-prism'
// alternative to the includeMarkdown plugin,
// which we need to shim cause of how we're fetching remote content here
import shimRemoteIncludes from 'lib/shim-remote-includes'
import { fixupPackerPluginUrls } from './fixup-plugin-urls'
import { fixupRedirectedPackerPlugins } from './fixup-redirected-plugin-urls'

async function generateStaticPaths({
	navDataFile,
	remotePluginsFile,
	mainBranch = 'main',
}) {
	const navData = await resolveNavDataWithRemotePlugins(navDataFile, {
		remotePluginsFile,
		mainBranch,
	})
	const paths = getPathsFromNavData(navData)
	return paths
}

/**
 * Given page params for a Packer plugins URL,
 * Return static props for the plugin document in question,
 * or `null` if a document cannot be found.
 */
async function generateStaticProps({
	localContentDir,
	mainBranch = 'main',
	editBranch = mainBranch,
	navDataFile,
	params,
	product,
	remotePluginsFile,
}: {
	localContentDir: string
	mainBranch?: string
	editBranch?: string
	navDataFile: string
	params: { page?: string[] }
	product: { name: string; slug: string }
	remotePluginsFile: string
}) {
	// Build the currentPath from page parameters
	const currentPath = params.page ? params.page.join('/') : ''
	// Resolve navData, including the possibility that this
	// page is a remote plugin docs, in which case we'll provide
	// the MDX fileString in the resolved navData
	const navData = await resolveNavDataWithRemotePlugins(navDataFile, {
		remotePluginsFile,
		currentPath,
		mainBranch,
	})
	// Attempt to match a navNode for this path.
	// Note that we may not be able to find a match, in which case we 404.
	let navNode
	try {
		navNode = getNodeFromPath(currentPath, navData, localContentDir)
	} catch (e) {
		const isNotFound = String(e).includes('Missing resource')
		if (isNotFound) {
			return null
		} else {
			throw e
		}
	}
	const { filePath, remoteFile, pluginData } = navNode
	//  Fetch the MDX file content
	const mdxString = remoteFile
		? remoteFile.fileString
		: fs.readFileSync(path.join(process.cwd(), filePath), 'utf8')
	// Construct the githubFileUrl, used for "Edit this page" link
	// Note: we expect remote files, such as those used to render plugin docs,
	// to have a sourceUrl defined, that points to the file we built from.
	/**
	 * Updated note: now that we have all external plugins on a separate route,
	 * as well as a separate `index.tsx` page file for the only non-remote
	 * MDX file (the /plugins landing page), the second part of this conditional
	 * is not expected to be relevant. The `editBranch` logic has been added
	 * for completeness, it may not actually see real use.
	 */
	const githubFileUrl = remoteFile
		? remoteFile.sourceUrl
		: `https://github.com/hashicorp/${product.slug}/blob/${editBranch}/website/${filePath}`
	// If this is a plugin, and if
	// the version has been specified as "latest",
	// determine the tag this corresponds to, so that
	// we can show this explicit version number in docs
	const latestReleaseTag =
		pluginData?.version === 'latest'
			? await fetchLatestReleaseTag(pluginData.repo)
			: pluginData?.version
	// For plugin pages, prefix the MDX content with a
	// label that reflects the plugin tier
	// (current options are "Official" or "Community")
	// and display whether the plugin is "HCP Packer Ready".
	// Also add a badge to show the latest version
	async function mdxContentHook(mdxContent) {
		const badgesMdx = []
		// Add a badge for the plugin tier
		if (pluginData?.pluginTier) {
			badgesMdx.push(`<PluginBadge type="${pluginData.pluginTier}" />`)
		}
		// Add a badge if the plugin is "HCP Packer Ready"
		if (pluginData?.isHcpPackerReady) {
			badgesMdx.push(`<PluginBadge type="hcp_packer_ready" />`)
		}
		// If the plugin is archived, add an "Archived" badge
		if (pluginData?.archived == true) {
			badgesMdx.push(`<PluginBadge type="archived" />`)
		}
		// Add badge showing the latest release version number,
		// and link this badge to the latest release
		if (latestReleaseTag) {
			const href = `https://github.com/${pluginData.repo}/releases/tag/${latestReleaseTag}`
			badgesMdx.push(
				`<Badge href="${href}" label="${latestReleaseTag}" theme="light-gray"/>`
			)
		}
		// If we have badges to add, inject them into the MDX
		if (badgesMdx.length > 0) {
			const badgeChildrenMdx = badgesMdx.join('')
			const badgesHeaderMdx = `<BadgesHeader>${badgeChildrenMdx}</BadgesHeader>`
			mdxContent = badgesHeaderMdx + '\n\n' + mdxContent
		}

		mdxContent = await shimRemoteIncludes(
			mdxContent,
			'packer',
			`refs/heads/${mainBranch}`
		)

		return mdxContent
	}

	const { data, content: rawContent } = grayMatter(mdxString)
	// We manually construct the frontMatter property here since grayMatter
	// types data as { [key: string]: any } which doesn't satisfy the frontMatter
	// type for DocsPage which requires specific properties.
	const frontMatter = {
		...data,
		canonical_url: data.canonical_url ?? null,
		description: data.description,
		page_title: data.page_title,
	}
	const content = await mdxContentHook(rawContent)

	// Set up URL adjuster function
	const dotIoToDevDotUrlAdjuster = getProductUrlAdjuster(
		packerProductData as ProductData
	)

	// Render MDX source, with options
	const headings = [] // populated by anchorLinks plugin below
	const mdxOptions: { remarkPlugins: Pluggable[]; rehypePlugins: Pluggable[] } =
		{
			remarkPlugins: [
				typography,
				[anchorLinks, { headings }],
				paragraphCustomAlerts,
				/**
				 * Rewrite docs content links, which are authored without prefix.
				 * For Packer plugins, we need to account for both plugin URL
				 * structure changes (which happened before the move to Dev Dot,
				 * but have not yet been updated in source), as well as for
				 * the usual dot-io-to-dev-dot transformations we run for
				 * all other products.
				 */
				[
					remarkPluginAdjustLinkUrls,
					{
						urlAdjustFn: (url) => {
							const withSpecificFixes = fixupRedirectedPackerPlugins(url)
							const withAllFixes = fixupPackerPluginUrls(withSpecificFixes)
							return dotIoToDevDotUrlAdjuster(withAllFixes)
						},
					},
				],
			],
			rehypePlugins: [
				[rehypePrism, { ignoreMissing: true }],
				rehypeSurfaceCodeNewlines,
			],
		}
	const { mdxSource } = await renderPageMdx(content, mdxOptions)

	return {
		currentPath,
		frontMatter,
		mdxSource,
		githubFileUrl,
		navData,
		navNode,
		headings,
		versions: [],
	}
}

export { generateStaticPaths, generateStaticProps, appendRemotePluginsNavData }
