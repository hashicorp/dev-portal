import terraformData from 'data/terraform.json'
import { ProductData } from 'types/products'
import { getStaticGenerationFunctions } from 'views/docs-view/utils/all-docs-server'
import DocsView from 'views/docs-view'

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

/**
 * Docs base paths configuration, aka rootDocsPaths.
 * TODO: move this to src/data/terraform.json
 */
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
		hasCustomLanding: true,
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

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
	basePathsConfig: TERRAFORM_DOCS_SUBPATHS,
	productData: terraformData as ProductData,
})

export { getStaticPaths, getStaticProps }
export default DocsView
