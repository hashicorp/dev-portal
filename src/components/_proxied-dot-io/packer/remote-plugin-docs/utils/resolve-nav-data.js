import path from 'path'
import fs from 'fs'
import { resolvePluginDocs } from '@hashicorp/platform-packer-plugins'
import fetchGithubFile from 'lib/fetch-github-file'
import { isContentDeployPreview } from 'lib/env-checks'

/**
 * Resolves nav-data from file with
 * resolution of remote plugin docs entries
 *
 * @param {string} navDataFile path to the nav-data.json file, relative to the `website` directory of the Packer GitHub repo. Example: "data/docs-nav-data.json".
 * @param {object} options optional configuration object
 * @param {string} options.remotePluginsFile path to a remote-plugins.json file, relative to the website directory of the Packer repo. Example: "data/docs-remote-plugins.json".
 * @param {string} options.mainBranch the main branch of the `hashicorp/packer` repo. This will be the default branch from which remote plugins and nav data will be fetched. Note that we will first see if Packer has a `getBetaLatestVersionRef` assigned (such as `dev-portal`) if so, that ref will be used instead.
 * @param {string} [options.currentPath] the path of the page that's invoking this function
 * @returns {Promise<array>} the resolved navData. This includes NavBranch nodes pulled from remote plugin repositories, as well as filePath properties on all local NavLeaf nodes, and remoteFile properties on all NavLeafRemote nodes.
 */
async function resolveNavDataWithRemotePlugins(navDataFile, options = {}) {
	const { remotePluginsFile, currentPath, mainBranch } = options

	let navDataContent
	if (isContentDeployPreview('packer')) {
		// When running in the context of hashicorp/packer, attempt to load the local file
		navDataContent = fs.readFileSync(
			path.join(process.cwd(), '..', navDataFile)
		)
	} else {
		navDataContent = await fetchGithubFile({
			owner: 'hashicorp',
			repo: 'packer',
			path: path.join('website', navDataFile),
			ref: mainBranch,
		})
	}

	let navData = JSON.parse(navDataContent)
	return await appendRemotePluginsNavData(
		remotePluginsFile,
		navData,
		currentPath
	)
}

export async function appendRemotePluginsNavData(
	remotePluginsFile,
	navData,
	currentPath,
	mainBranch = 'main'
) {
	// Read in and parse the plugin configuration JSON
	let remotePluginsContent
	if (isContentDeployPreview('packer')) {
		// When running in the context of hashicorp/packer, attempt to load the local file
		remotePluginsContent = fs.readFileSync(
			path.join(process.cwd(), '..', remotePluginsFile)
		)
	} else {
		remotePluginsContent = await fetchGithubFile({
			owner: 'hashicorp',
			repo: 'packer',
			path: path.join('website', remotePluginsFile),
			ref: mainBranch,
		})
	}

	const pluginEntries = JSON.parse(remotePluginsContent)
	// Add navData for each plugin's component.
	// Note that leaf nodes include a remoteFile property object with the full MDX fileString
	const pluginEntriesWithFiles = await resolvePluginDocs(pluginEntries)

	const navDataFromPluginEntries = await Promise.all(
		pluginEntriesWithFiles.map(
			async (entry) => await transformPluginEntriesToNavData(entry, currentPath)
		)
	)

	const titleMap = {
		builders: 'Builders',
		provisioners: 'Provisioners',
		'post-processors': 'Post-Processors',
		datasources: 'Data Sources',
	}

	return navData.concat(
		navDataFromPluginEntries.map((entry) => {
			return {
				title: entry.title,
				routes: Object.entries(entry.components).map(
					([type, componentList]) => {
						return {
							title: titleMap[type],
							// Flat map to avoid ┐
							// > Proxmox         │
							//   > Builders      │
							//     > Proxmox <---┘
							//       > Overview
							//       > Clone
							//       > ISO
							routes: componentList.flatMap((c) => {
								if ('path' in c) {
									return c
								} else if ('routes' in c) {
									return c.routes
								}
							}),
						}
					}
				),
			}
		})
	)
}

// Transform each plugin's array of .mdx files into navData.
// Organize this navData by component, add it to the plugin config entry,
// and return the modified entry.
//
// Note that navData leaf nodes have a special remoteFile property,
// which contains { filePath, fileString } data for the remote
// plugin doc .mdx file
async function transformPluginEntriesToNavData(pluginConfigEntry, currentPath) {
	const { title, path: slug, files } = pluginConfigEntry

	const sortedFiles = [...files].sort((a, b) => {
		// ensure casing does not affect ordering
		const aTitle = a.title.toLowerCase()
		const bTitle = b.title.toLowerCase()
		// (exception: "Overview" comes first)
		if (aTitle === 'overview') {
			return -1
		}
		if (bTitle === 'overview') {
			return 1
		}
		return aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0
	})

	const navNodes = sortedFiles.map(({ title, path, ...file }) => ({
		title,
		path,
		remoteFile: { ...file },
		pluginData: { ...pluginConfigEntry, files: [] },
	}))

	// Bucket each node by type
	const navNodesByComponent = navNodes.reduce((acc, navLeaf) => {
		const componentType = navLeaf.remoteFile.filePath.split('/')[1]
		if (!acc[componentType]) {
			acc[componentType] = []
		}
		acc[componentType].push(navLeaf)
		return acc
	}, {})

	//
	const components = Object.keys(navNodesByComponent).map((type) => {
		// Plugins many not contain every component type,
		// we return null if this is the case
		const rawNavNodes = navNodesByComponent[type]
		if (!rawNavNodes) {
			return null
		}
		// Avoid unnecessary nesting if there's only a single doc file
		const navData = normalizeNavNodes(title, rawNavNodes)
		// Prefix paths to fit into broader docs nav-data
		const pathPrefix = path.join(type, slug)
		const withPrefixedPaths = visitNavLeaves(navData, (n) => {
			const prefixedPath = path.join(pathPrefix, n.path)
			return { ...n, path: prefixedPath }
		})
		// If currentPath is provided, then remove the remoteFile
		// from all nodes except the currentPath. This ensures we deliver
		// only a single fileString in our getStaticProps JSON.
		// Without this optimization, we would send all fileStrings
		// for all NavLeafRemote nodes
		const withOptimizedFileStrings = visitNavLeaves(withPrefixedPaths, (n) => {
			if (!n.remoteFile) {
				return n
			}
			const noCurrentPath = typeof currentPath === 'undefined'
			const isPathMatch = currentPath === n.path
			if (noCurrentPath || isPathMatch) {
				return n
			}
			const { filePath } = n.remoteFile
			return { ...n, remoteFile: { filePath } }
		})
		// Return the component, with processed navData
		return { type, navData: withOptimizedFileStrings }
	})
	const componentsObj = components.reduce((acc, component) => {
		if (!component) {
			return acc
		}
		acc[component.type] = component.navData
		return acc
	}, {})
	return { ...pluginConfigEntry, files: [], components: componentsObj }
}

// For components with a single doc file, transform so that
// a single leaf node renders, rather than a nav branch
function normalizeNavNodes(pluginName, routes) {
	const isSingleLeaf =
		routes.length === 1 && typeof routes[0].path !== 'undefined'
	const navData = isSingleLeaf
		? [{ ...routes[0], path: '' }]
		: [{ title: pluginName, routes }]
	return navData
}

// Traverse a clone of the given navData,
// modifying any NavLeaf nodes with the provided visitFn
function visitNavLeaves(navData, visitFn) {
	return navData.slice().map((navNode) => {
		if (typeof navNode.path !== 'undefined') {
			return visitFn(navNode)
		}
		if (navNode.routes) {
			return { ...navNode, routes: visitNavLeaves(navNode.routes, visitFn) }
		}
		return navNode
	})
}

export default resolveNavDataWithRemotePlugins
