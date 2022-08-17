import { ProductData } from 'types/products'
import { getDocsNavItems } from '../get-docs-nav-items'

describe('getDocsNavItems', () => {
	it('uses docsNavItems if present, combining rootDocsPaths and custom items', () => {
		//
		const productData: Pick<
			ProductData,
			'slug' | 'rootDocsPaths' | 'docsNavItems'
		> = {
			slug: 'terraform',
			docsNavItems: [
				'docs',
				'cli',
				{
					icon: 'provider',
					label: 'Provider Use',
					fullPath: '/terraform/language/providers',
				},
				'plugin',
			],
			rootDocsPaths: [
				{
					iconName: 'terminal-screen',
					name: 'Terraform CLI',
					path: 'cli',
				},
				{
					iconName: 'docs',
					name: 'General Documentation',
					path: 'docs',
				},
				{
					iconName: 'plugin',
					name: 'Plugin Development',
					path: 'plugin',
				},
			],
		}
		//
		const expected = [
			{
				icon: 'docs',
				label: 'General Documentation',
				fullPath: '/terraform/docs',
			},
			{
				icon: 'terminal-screen',
				label: 'Terraform CLI',
				fullPath: '/terraform/cli',
			},
			{
				icon: 'provider',
				label: 'Provider Use',
				fullPath: '/terraform/language/providers',
			},
			{
				icon: 'plugin',
				label: 'Plugin Development',
				fullPath: '/terraform/plugin',
			},
		]
		//
		const result = getDocsNavItems(productData)
		expect(result).toEqual(expected)
	})

	it('uses rootDocsPaths if docsNavItems are not present', () => {
		//
		const productData: Pick<ProductData, 'slug' | 'rootDocsPaths'> = {
			slug: 'vault',
			rootDocsPaths: [
				{
					iconName: 'docs',
					name: 'General Documentation',
					path: 'docs',
				},
				{
					iconName: 'api',
					name: 'API',
					path: 'api-docs',
				},
			],
		}
		//
		const expected = [
			{
				icon: 'docs',
				label: 'General Documentation',
				fullPath: '/vault/docs',
			},
			{
				icon: 'api',
				label: 'API',
				fullPath: '/vault/api-docs',
			},
		]
		//
		const result = getDocsNavItems(productData)
		expect(result).toEqual(expected)
	})
})
