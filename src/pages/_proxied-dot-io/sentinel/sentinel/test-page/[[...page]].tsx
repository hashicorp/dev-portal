import { Products } from '@hashicorp/platform-product-meta'
import SentinelIoLayout from 'layouts/_proxied-dot-io/sentinel'
import DocsPage from 'components/_proxied-dot-io/common/docs-page'
import { isVersionedDocsEnabled } from 'lib/env-checks'
import productData from 'data/sentinel.json'
// Imports below are used in getStatic functions only
// import { getStaticGenerationFunctions } from 'lib/_proxied-dot-io/get-static-generation-functions'

const product = { name: productData.name, slug: productData.slug as Products }
const basePath = 'sentinel/intro'
// const navDataFile = `../data/intro-nav-data.json`
// const localContentDir = `../content/${basePath}`
// const localPartialsDir = `../content/partials`
const enableVersionedDocs = isVersionedDocsEnabled(productData.slug)
const additionalComponents = {}

const PLACEHOLDER_PROPS = {
	versions: [
		{
			name: 'latest',
			label: 'v0.22.x (latest)',
			isLatest: true,
			releaseStage: 'stable',
			version: 'v0.22.x',
		},
		{
			name: 'v0.21.x',
			label: 'v0.21.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.21.x',
		},
		{
			name: 'v0.20.x',
			label: 'v0.20.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.20.x',
		},
		{
			name: 'v0.19.x',
			label: 'v0.19.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.19.x',
		},
		{
			name: 'v0.18.x',
			label: 'v0.18.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.18.x',
		},
		{
			name: 'v0.17.x',
			label: 'v0.17.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.17.x',
		},
		{
			name: 'v0.16.x',
			label: 'v0.16.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.16.x',
		},
		{
			name: 'v0.15.x',
			label: 'v0.15.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.15.x',
		},
		{
			name: 'v0.14.x',
			label: 'v0.14.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.14.x',
		},
		{
			name: 'v0.13.x',
			label: 'v0.13.x',
			isLatest: false,
			releaseStage: 'stable',
			version: 'v0.13.x',
		},
	],
	currentPath: '',
	frontMatter: {
		layout: 'intro',
		description:
			'Sentinel is a language and framework for policy built to be embedded in existing software to enable fine-grained, logic-based policy decisions.',
		sidebar_current: 'docs-home',
		page_title: 'Documentation',
	},
	githubFileUrl:
		'https://github.com/hashicorp/sentinel/blob/main/website/content/sentinel/intro/index.mdx',
	mdxSource: {
		compiledSource:
			'var m=Object.defineProperty,p=Object.defineProperties;var u=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var r=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable;var l=(e,n,t)=>n in e?m(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,a=(e,n)=>{for(var t in n||(n={}))r.call(n,t)&&l(e,t,n[t]);if(i)for(var t of i(n))s.call(n,t)&&l(e,t,n[t]);return e},d=(e,n)=>p(e,u(n));var c=(e,n)=>{var t={};for(var o in e)r.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(e!=null&&i)for(var o of i(e))n.indexOf(o)<0&&s.call(e,o)&&(t[o]=e[o]);return t};const layoutProps={},MDXLayout="wrapper";function MDXContent(t){var o=t,{components:e}=o,n=c(o,["components"]);return mdx(MDXLayout,d(a(a({},layoutProps),n),{components:e,mdxType:"MDXLayout"}),mdx("h1",a({},{className:"g-type-display-2",id:"sentinel-documentation"}),mdx("a",a({parentName:"h1"},{className:"__permalink-h",href:"#sentinel-documentation","aria-label":"sentinel documentation permalink"}),"\\xBB"),"Sentinel Documentation"),mdx("p",a({},{className:"g-type-long-body"}),"Welcome to the Sentinel documentation!"),mdx("p",a({},{className:"g-type-long-body"}),`Sentinel is a language and framework for policy built to be embedded\nin existing software to enable fine-grained, logic-based policy decisions.\nA policy describes under what circumstances certain behaviors are allowed.\nSentinel is an enterprise-only feature of HashiCorp Consul, Nomad, Terraform,\nand Vault.`),mdx("p",a({},{className:"g-type-long-body"}),`This documentation should serve as a reference guide for developing Sentinel\npolicies, embedding Sentinel into your own software, extending Sentinel with\nplugins, and more. If you\'re just getting started with Sentinel, please start with the\n`,mdx("a",a({parentName:"p"},{href:"/sentinel/intro"}),"introduction"),` to understand what Sentinel is, how it\ncompares to other software, and more.`),mdx("iframe",{src:"https://www.youtube.com/embed/Vy8s7AAvU6g",frameborder:"0",allowfullscreen:"true",width:"560",height:"315"}))}MDXContent.isMDXComponent=!0;\n',
		scope: { version: 'latest' },
	},
	navData: [
		{ title: 'What is Sentinel?', path: 'what' },
		{ title: 'Why Sentinel?', path: 'why' },
		{
			title: 'Getting Started',
			routes: [
				{ title: 'Overview', path: 'getting-started' },
				{ title: 'Installing the CLI', path: 'getting-started/install' },
				{ title: 'Your First Policy', path: 'getting-started/first-policy' },
				{ title: 'Rules', path: 'getting-started/rules' },
				{ title: 'Logic', path: 'getting-started/logic' },
				{ title: 'Imports', path: 'getting-started/imports' },
				{ title: 'Testing', path: 'getting-started/testing' },
				{ title: 'Next Steps', path: 'getting-started/next-steps' },
			],
		},
	],
}

function DocsView() {
	return (
		<DocsPage
			product={product}
			baseRoute={basePath}
			staticProps={PLACEHOLDER_PROPS as $TSFixMe}
			additionalComponents={additionalComponents}
			showVersionSelect={enableVersionedDocs}
			algoliaConfig={productData.algoliaConfig}
			showEditPage={false}
		/>
	)
}

// const { getStaticProps } = getStaticGenerationFunctions(
// 	enableVersionedDocs
// 		? {
// 				strategy: 'remote',
// 				basePath,
// 				fallback: 'blocking',
// 				product: productData.slug,
// 		  }
// 		: {
// 				strategy: 'fs',
// 				localContentDir,
// 				navDataFile,
// 				localPartialsDir,
// 				product: productData.slug,
// 		  }
// )

export async function getStaticPaths(context) {
	// const result = await generatedGetStaticPaths(context)
	return { paths: [{ params: { page: [] } }], fallback: false }
}

export async function getStaticProps(context) {
	return { props: {} }
}

// Export view with layout
DocsView.layout = SentinelIoLayout
export default DocsView
