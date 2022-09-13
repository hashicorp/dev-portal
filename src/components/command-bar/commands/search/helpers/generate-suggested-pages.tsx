import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import ProductIcon from 'components/product-icon'
import { SuggestedPage } from '../suggested-pages'

const generateTutorialLibrarySuggestedPage = (productSlug?: ProductSlug) => {
	// TODO abstract this, or leverage abstraction from tutorial library feature
	let url = '/tutorials/library'
	if (productSlug) {
		url += `?product=${productSlug}`
	}

	return {
		icon: <IconGuide16 />,
		text: 'Tutorial Library',
		url,
	}
}

const DEFAULT_SUGGESTED_PAGES = [
	...[
		'hcp',
		'terraform',
		'packer',
		'vault',
		'boundary',
		'consul',
		'nomad',
		'waypoint',
		'vagrant',
	].map((productSlug: ProductSlug) => ({
		icon: <ProductIcon productSlug={productSlug} />,
		text: productSlugsToNames[productSlug],
		url: `/${productSlug}`,
	})),
	generateTutorialLibrarySuggestedPage(),
]

const generateBasicSuggestedPages = (productSlug: ProductSlug) => {
	const pages = [
		{ icon: <IconDocs16 />, text: 'Documentation', path: 'docs' },
		{ icon: <IconDownload16 />, text: 'Install', path: 'downloads' },
		{ icon: <IconLearn16 />, text: 'Tutorials', path: 'tutorials' },
	].map(({ icon, text, path }) => {
		let fullText
		if (productSlug === 'hcp') {
			fullText = `HCP ${text}`
		} else {
			fullText = `${productSlugsToNames[productSlug]} ${text}`
		}

		return {
			icon,
			text: fullText,
			url: `/${productSlug}/${path}`,
		}
	})

	if (productSlug === 'hcp') {
		return pages.filter((page) => page.url !== '/hcp/downloads')
	}

	return pages
}

/**
 * These are pages listed after the main pages for a product, and just before a
 * link to the Ttorials Library.
 */
const EXTRA_PAGES: Record<Exclude<ProductSlug, 'sentinel'>, SuggestedPage[]> = {
	boundary: [
		{
			icon: <IconDocs16 />,
			text: 'HCP Boundary',
			url: '/hcp/docs/boundary',
		},
		{
			icon: <IconDocs16 />,
			text: 'Connect to Your First Target',
			url: '/boundary/docs/getting-started/connect-to-target',
		},
		{
			icon: <IconDocs16 />,
			text: 'Concepts',
			url: '/boundary/docs/concepts',
		},
	],
	consul: [
		{
			icon: <IconDocs16 />,
			text: 'HCP Consul',
			url: '/hcp/docs/consul',
		},
		{
			icon: <IconDocs16 />,
			text: 'API',
			url: '/consul/docs/api-docs',
		},
		{
			icon: <IconDocs16 />,
			text: 'Commands (CLI)',
			url: '/consul/docs/commands',
		},
	],
	hcp: [
		{
			icon: <IconDocs16 />,
			text: 'HCP Vault',
			url: '/hcp/docs/vault',
		},
		{
			icon: <IconDocs16 />,
			text: 'What is HCP?',
			url: '/hcp/docs/hcp',
		},
		{
			icon: <IconDocs16 />,
			text: 'HCP Packer',
			url: '/hcp/docs/packer',
		},
		{
			icon: <IconDocs16 />,
			text: 'HCP Consul',
			url: '/hcp/docs/consul',
		},
		{
			icon: <IconDocs16 />,
			text: 'HCP Boundary',
			url: '/hcp/docs/boundary',
		},
	],
	nomad: [
		{
			icon: <IconDocs16 />,
			text: 'API',
			url: '/nomad/api-docs',
		},
		{
			icon: <IconDocs16 />,
			text: 'Tools',
			url: '/nomad/tools',
		},
		{
			icon: <IconDocs16 />,
			text: 'Plugins',
			url: '/nomad/plugins',
		},
	],
	packer: [
		{
			icon: <IconDocs16 />,
			text: 'HCP Packer',
			url: '/hcp/docs/packer',
		},
		{
			icon: <IconDocs16 />,
			text: 'AMI Builder (EBS backed)',
			url: '/packer/plugins/builders/amazon/ebs',
		},
		{
			icon: <IconDocs16 />,
			text: 'Plugins',
			url: '/packer/plugins',
		},
	],
	terraform: [
		{
			icon: <IconDocs16 />,
			text: 'Terraform Cloud',
			url: '/terraform/cloud-docs',
		},
		{
			icon: <IconDocs16 />,
			text: 'Configuration Language',
			url: '/terraform/language',
		},
		{
			icon: <IconDocs16 />,
			text: 'CDK for Terraform',
			url: '/terraform/cdktf',
		},
	],
	vagrant: [
		{
			icon: <IconDocs16 />,
			text: 'Vagrant Cloud',
			url: '/vagrant/vagrant-cloud',
		},
		{
			icon: <IconDocs16 />,
			text: 'Commands (CLI)',
			url: '/vagrant/docs/cli',
		},
		{
			icon: <IconDocs16 />,
			text: 'Boxes',
			url: '/vagrant/docs/boxes',
		},
	],
	vault: [
		{
			icon: <IconDocs16 />,
			text: 'HCP Boundary',
			url: '/hcp/docs/boundary',
		},
		{
			icon: <IconDocs16 />,
			text: 'Connect to Your First Target',
			url: '/boundary/docs/getting-started/connect-to-target',
		},
		{
			icon: <IconDocs16 />,
			text: 'Concepts',
			url: '/boundary/docs/concepts',
		},
	],
	waypoint: [
		{
			icon: <IconDocs16 />,
			text: 'Getting Started with Waypoint',
			url: '/waypoint/',
		},
		{
			icon: <IconDocs16 />,
			text: 'Waypoint URL Service',
			url: '/waypoint/docs/url',
		},
		{
			icon: <IconDocs16 />,
			text: 'Kubernetes (plugins/kubernetes)',
			url: '/waypoint/plugins/kubernetes',
		},
	],
}

/**
 * @TODO potential optimization: cache the result in React Query forever (since
 * the list won't change while a user is actively using the site).
 */
const generateSuggestedPages = (productSlug?: ProductSlug): SuggestedPage[] => {
	const extraPages = productSlug && EXTRA_PAGES[productSlug]
	if (extraPages) {
		return [
			...generateBasicSuggestedPages(productSlug),
			...extraPages,
			generateTutorialLibrarySuggestedPage(productSlug),
		]
	} else {
		return DEFAULT_SUGGESTED_PAGES
	}
}

export { generateSuggestedPages }
