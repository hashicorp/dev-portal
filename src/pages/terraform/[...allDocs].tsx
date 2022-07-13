import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import DocsView from 'views/docs-view'

// function DocsView(props) {
// 	return (
// 		<>
// 			<pre>
// 				<code>{JSON.stringify(props, null, 2)}</code>
// 			</pre>
// 			<pre>
// 				<code>{JSON.stringify({ propKeys: Object.keys(props) }, null, 2)}</code>
// 			</pre>
// 		</>
// 	)
// }

/*
Subpath				      Repository
----------------------------------------------
/cdktf			      	terraform-cdk
/cli		  	      	terraform
/cloud-docs		    	terraform-docs-common
/cloud-docs/agents	terraform-docs-agents
/configuration	  	terraform
/docs			        	terraform
/enterprise		    	ptfe-releases
/guides		      		terraform
/internals	    		terraform
/intro		      		terraform
/language		      	terraform
/plugin		      		terraform-docs-common
/plugin/framework   terraform-plugin-framework
/plugin/log		    	terraform-plugin-log
/plugin/mux	    		terraform-plugin-mux
/plugin/sdkv2   		terraform-plugin-sdk
/registry			      terraform-docs-common
*/

const PRODUCT_DATA = terraformData as ProductData
const TERRAFORM_DOCS_SUBPATHS = {
	cdktf: {
		baseName: 'CDKTF',
		productSlugForLoader: 'terraform-cdk',
	},
	cli: {
		baseName: 'CLI',
		productSlugForLoader: 'terraform',
	},
	'cloud-docs': {
		baseName: 'Cloud Docs',
		productSlugForLoader: 'terraform-docs-common',
	},
	'cloud-docs/agents': {
		baseName: 'Cloud Docs Agents',
		productSlugForLoader: 'terraform-docs-agents',
		navDataPrefix: 'cloud-docs-agents',
	},
	configuration: {
		baseName: 'Configuration',
		productSlugForLoader: 'terraform',
	},
	docs: {
		baseName: 'Docs',
		productSlugForLoader: 'terraform',
	},
	enterprise: {
		baseName: 'Enterprise',
		productSlugForLoader: 'ptfe-releases',
	},
	guides: {
		baseName: 'Guides',
		productSlugForLoader: 'terraform',
	},
	internals: {
		baseName: 'Internals',
		productSlugForLoader: 'terraform',
	},
	intro: {
		baseName: 'Intro',
		productSlugForLoader: 'terraform',
	},
	language: {
		baseName: 'Language',
		productSlugForLoader: 'terraform',
	},
	plugin: {
		baseName: 'Plugin',
		productSlugForLoader: 'terraform-docs-common',
	},
	'plugin/framework': {
		baseName: 'Plugin Framework',
		productSlugForLoader: 'terraform-plugin-framework',
		navDataPrefix: 'plugin-framework',
	},
	'plugin/log': {
		baseName: 'Plugin Log',
		productSlugForLoader: 'terraform-plugin-log',
		navDataPrefix: 'plugin-log',
	},
	'plugin/mux': {
		baseName: 'Plugin mux',
		productSlugForLoader: 'terraform-plugin-mux',
		navDataPrefix: 'plugin-mux',
	},
	'plugin/sdkv2': {
		baseName: 'Plugin sdkv2',
		productSlugForLoader: 'terraform-plugin-sdk',
		navDataPrefix: 'plugin-sdk',
	},
	registry: {
		baseName: 'Registry',
		productSlugForLoader: 'terraform-docs-common',
	},
}

async function getSubpathStaticPaths({
	basePath,
	baseName,
	productSlugForLoader,
	navDataPrefix,
}: {
	basePath: string
	baseName: string
	productSlugForLoader: string
	navDataPrefix?: string
}) {
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
	const { getStaticPaths: generatedGetStaticPaths } =
		getStaticGenerationFunctions({
			product: PRODUCT_DATA,
			productSlugForLoader,
			basePath,
			baseName,
			navDataPrefix,
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
	let paths = []
	for (const [basePath, config] of Object.entries(TERRAFORM_DOCS_SUBPATHS)) {
		const subpathPaths = await getSubpathStaticPaths({ basePath, ...config })
		paths = paths.concat(subpathPaths)
	}
	// Return all generated paths
	// TODO: for "custom" docs landing pages, we'll need to exclude some routes
	// TODO: fallback: "blocking" inferred from lower level generated fns (?)
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
	const allBasePaths = Object.keys(TERRAFORM_DOCS_SUBPATHS)
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
	const { baseName, productSlugForLoader, navDataPrefix } =
		TERRAFORM_DOCS_SUBPATHS[basePath]
	// Call getStaticProps using configuration for the target basePath
	// TODO: feels weird invoking this within getStaticPaths.
	// TODO: maybe there's another way?
	const { getStaticProps: generatedGetStaticProps } =
		getStaticGenerationFunctions({
			product: PRODUCT_DATA,
			productSlugForLoader,
			basePath,
			baseName,
			navDataPrefix,
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
