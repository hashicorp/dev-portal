import nomadData from 'data/nomad.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
// import DocsView from 'views/docs-view'

function DocsView(props) {
	return (
		<>
			<pre>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
		</>
	)
}

const PRODUCT_DATA = nomadData as ProductData

const CUSTOM_DOCS_LANDING_PATHS = ['api-docs', 'docs']

/**
 * TODO: 🚨 wasn't there some proxy slash redirect stuff
 * TODO: 🚨 that relied on reading files in `src/pages`?
 * TODO: 🚨 will the [...allDocs] approach break it?
 *
 * If so, maybe this "subpath config" would be useful
 * for that redirects work. Less dangerous inferring of directories.
 * Also kind of require if [..allDocs] is indeed breaking anything
 * redirect-slash-dot-io related..
 */
const NOMAD_DOCS_SUBPATHS = {
	'api-docs': { baseName: 'API' },
	docs: { baseName: 'Docs' },
	intro: { baseName: 'Intro' },
	plugins: { baseName: 'Plugins', showVersionSelect: false },
	tools: { baseName: 'Tools', showVersionSelect: false },
}

async function getSubpathStaticPaths({
	basePath,
	baseName,
	productSlugForLoader,
	showVersionSelect,
}: // navDataPrefix,
{
	basePath: string
	baseName: string
	productSlugForLoader?: string
	showVersionSelect?: boolean
	// navDataPrefix?: string
}) {
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
	const { getStaticPaths: generatedGetStaticPaths } =
		getStaticGenerationFunctions({
			product: PRODUCT_DATA,
			productSlugForLoader,
			basePath,
			baseName,
			showVersionSelect,
			// navDataPrefix,
		})
	// Call the generated, base-path-specific getStaticPaths.
	// Note that the context argument is not used, but must be provided.
	const { paths: rawPaths } = await generatedGetStaticPaths({})
	// Map the rawPaths to prefix them with the current docs subpath
	const paths = rawPaths.reduce((acc, entry) => {
		//
		if (typeof entry === 'string') {
			return acc
		}
		//
		const { page } = entry.params
		const pageParams = typeof page == 'string' ? [page] : page
		//
		acc.push({
			params: {
				// TODO: basePath might have a slash in it.
				// TODO: this might not matter, not sure... ... but might be nice to
				// TODO: explicitly make sure that each param entry string
				// TODO: does NOT have slashes in it?
				allDocs: [basePath, ...pageParams],
			},
			locale: entry.locale,
		})
		//
		return acc
	}, [])

	return paths
}

export async function getStaticPaths() {
	// Gather all paths from all possible subpaths
	let allPaths = []
	for (const [basePath, subpathConfig] of Object.entries(NOMAD_DOCS_SUBPATHS)) {
		const subpathPaths = await getSubpathStaticPaths({
			basePath,
			...subpathConfig,
		})
		allPaths = allPaths.concat(subpathPaths)
	}
	// Return all generated paths
	// Filter out paths used for "custom" docs landing pages

	const paths = allPaths.filter((entry) => {
		const params = entry.params.allDocs
		const fullPath = params.join('/')
		const isDocsCustomLanding = CUSTOM_DOCS_LANDING_PATHS.reduce(
			(acc, landingPath) => {
				return acc || fullPath == landingPath || fullPath == `${landingPath}/`
			},
			false
		)
		//
		return !isDocsCustomLanding
	})
	// Add some paths for dev
	return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
	// Determine which basePath we're working with, from incoming params
	const [targetBasePath, maybeTargetBasePath, ...restParams] = params.allDocs
	let basePath
	let pageParams
	// Note that some basePaths are nested, such as "cloud-docs/agents"
	// For these paths, we need to massage params even further to get the
	// pageParams we can pass to the usual docs getStaticProps loader
	const maybeNestedBasePath = [targetBasePath, maybeTargetBasePath].join('/')
	const allBasePaths = Object.keys(NOMAD_DOCS_SUBPATHS)
	const isNestedBasePath = allBasePaths.indexOf(maybeNestedBasePath) !== -1
	if (isNestedBasePath) {
		basePath = maybeNestedBasePath
		pageParams = [...restParams]
	} else {
		basePath = targetBasePath
		pageParams =
			typeof maybeTargetBasePath !== 'undefined'
				? [maybeTargetBasePath, ...restParams]
				: [...restParams]
	}
	// Get the config for the target basePath
	const subpathConfig = NOMAD_DOCS_SUBPATHS[basePath]
	// Call getStaticProps using configuration for the target basePath
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
	const { getStaticProps: generatedGetStaticProps } =
		getStaticGenerationFunctions({
			product: PRODUCT_DATA,
			basePath,
			...subpathConfig,
		})
	// Note that the context { params } are constructed here, not passed directly.
	const staticProps = await generatedGetStaticProps({
		params: { page: pageParams },
	})
	//
	// return staticProps
	return staticProps
}
export default DocsView
