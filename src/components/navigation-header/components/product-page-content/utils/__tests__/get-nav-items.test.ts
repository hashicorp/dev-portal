/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { getLeftSideNavItems, getRightSideNavItems } from '../get-nav-items'
import { ProductData } from 'types/products'

// Might want to update tests to try Certifications subnav redirects
const isCertifications = false

const testNomadData = {
	slug: 'nomad',
	rootDocsPaths: [
		{
			iconName: 'docs',
			name: 'Documentation',
			path: 'docs',
			shortName: 'Docs',
			includeMDXSource: true,
		},
		{
			iconName: 'terminal-screen',
			name: 'CLI',
			path: 'commands',
		},
	],
} as ProductData

const testTerraformData = {
	slug: 'terraform',
	docsNavItems: [
		'docs',
		'language',
		'cdktf',
		'cli',
		'cloud-docs',
		'enterprise',
		{
			icon: 'provider',
			label: 'Provider Use',
			fullPath: '/terraform/language/providers',
		},
		'plugin',
		'registry',
		{
			icon: 'plus-circle',
			label: 'Integration Program',
			fullPath: '/terraform/docs/partnerships',
		},
	],
	rootDocsPaths: [
		{
			iconName: 'tools',
			name: 'CDK for Terraform',
			path: 'cdktf',
			productSlugForLoader: 'terraform-cdk',
		},
		{
			iconName: 'terminal-screen',
			name: 'Terraform CLI',
			path: 'cli',
		},
		{
			iconName: 'cloud',
			name: 'Terraform Cloud',
			path: 'cloud-docs',
			productSlugForLoader: 'terraform-docs-common',
		},
		{
			iconName: 'cloud',
			name: 'HCP Terraform Agents',
			navDataPrefix: 'cloud-docs-agents',
			path: 'cloud-docs/agents',
			productSlugForLoader: 'terraform-docs-agents',
		},
		{
			iconName: 'docs',
			name: 'Documentation',
			path: 'docs',
			productSlugForLoader: 'terraform-docs-common',
		},
		{
			iconName: 'enterprise',
			name: 'Terraform Enterprise',
			path: 'enterprise',
			productSlugForLoader: 'terraform-enterprise',
		},
		{
			iconName: 'docs',
			name: 'Internals',
			path: 'internals',
		},
		{
			iconName: 'docs',
			name: 'Intro',
			path: 'intro',
		},
		{
			iconName: 'file-source',
			name: 'Configuration Language',
			path: 'language',
		},
		{
			iconName: 'plug',
			name: 'Plugin Development',
			path: 'plugin',
			productSlugForLoader: 'terraform-docs-common',
		},
		{
			iconName: 'plug',
			name: 'Framework',
			navDataPrefix: 'plugin-framework',
			path: 'plugin/framework',
			productSlugForLoader: 'terraform-plugin-framework',
		},
		{
			iconName: 'plug',
			name: 'Log',
			navDataPrefix: 'plugin-log',
			path: 'plugin/log',
			productSlugForLoader: 'terraform-plugin-log',
		},
		{
			iconName: 'plug',
			name: 'mux',
			navDataPrefix: 'plugin-mux',
			path: 'plugin/mux',
			productSlugForLoader: 'terraform-plugin-mux',
		},
		{
			iconName: 'plug',
			name: 'SDKv2',
			path: 'plugin/sdkv2',
			productSlugForLoader: 'terraform-plugin-sdk',
			navDataPrefix: 'plugin-sdk',
		},
		{
			iconName: 'database',
			name: 'Registry Publishing',
			path: 'registry',
			productSlugForLoader: 'terraform-docs-common',
		},
	],
} as ProductData

const testHCPData = {
	slug: 'hcp',
	rootDocsPaths: [
		{
			iconName: 'docs',
			name: 'Documentation',
			path: 'docs',
			shortName: 'Docs',
			productSlugForLoader: 'cloud.hashicorp.com',
		},
	],
} as ProductData

const testConsulData = {
	slug: 'consul',
	name: 'Consul',
	rootDocsPaths: [
		{
			iconName: 'docs',
			name: 'Documentation',
			path: 'docs',
			shortName: 'Docs',
		},
	],
} as ProductData

describe('getLeftSideNavItems', () => {
	it('for most products, returns the standard set of items', () => {
		expect(getLeftSideNavItems(testNomadData, isCertifications))
			.toMatchInlineSnapshot(`
			[
			  {
			    "label": "Install",
			    "url": "/nomad/install",
			  },
			  {
			    "label": "Tutorials",
			    "url": "/nomad/tutorials",
			  },
			  {
			    "label": "Documentation",
			    "url": "/nomad/docs",
			  },
			  {
			    "label": "CLI",
			    "url": "/nomad/commands",
			  },
			  {
			    "label": "Sandbox",
			    "url": "/nomad/sandbox",
			  },
			  {
			    "label": "Integrations",
			    "url": "/nomad/integrations",
			  },
			]
		`)
	})

	it('for Terraform, returns the standard set of items with a Documentation dropdown', () => {
		expect(getLeftSideNavItems(testTerraformData, isCertifications))
			.toMatchInlineSnapshot(`
			[
			  {
			    "label": "Install",
			    "url": "/terraform/install",
			  },
			  {
			    "label": "Tutorials",
			    "url": "/terraform/tutorials",
			  },
			  {
			    "iconColorTheme": "terraform",
			    "items": [
			      {
			        "icon": "docs",
			        "label": "Documentation",
			        "path": "/terraform/docs",
			      },
			      {
			        "icon": "file-source",
			        "label": "Configuration Language",
			        "path": "/terraform/language",
			      },
			      {
			        "icon": "tools",
			        "label": "CDK for Terraform",
			        "path": "/terraform/cdktf",
			      },
			      {
			        "icon": "terminal-screen",
			        "label": "Terraform CLI",
			        "path": "/terraform/cli",
			      },
			      {
			        "icon": "cloud",
			        "label": "Terraform Cloud",
			        "path": "/terraform/cloud-docs",
			      },
			      {
			        "icon": "enterprise",
			        "label": "Terraform Enterprise",
			        "path": "/terraform/enterprise",
			      },
			      {
			        "icon": "provider",
			        "label": "Provider Use",
			        "path": "/terraform/language/providers",
			      },
			      {
			        "icon": "plug",
			        "label": "Plugin Development",
			        "path": "/terraform/plugin",
			      },
			      {
			        "icon": "database",
			        "label": "Registry Publishing",
			        "path": "/terraform/registry",
			      },
			      {
			        "icon": "plus-circle",
			        "label": "Integration Program",
			        "path": "/terraform/docs/partnerships",
			      },
			    ],
			    "label": "Documentation",
			  },
			  {
			    "label": "Sandbox",
			    "url": "/terraform/sandbox",
			  },
			]
		`)
	})

	it('for HCP, returns documentation nav link without dropdown', () => {
		expect(getLeftSideNavItems(testHCPData, isCertifications))
			.toMatchInlineSnapshot(`
			[
			  {
			    "label": "Tutorials",
			    "url": "/hcp/tutorials",
			  },
			  {
			    "label": "Documentation",
			    "url": "/hcp/docs",
			  },
			]
		`)
	})
})

describe('getRightSideNavItems', () => {
	it('for most products, returns no items', () => {
		expect(
			getRightSideNavItems(testNomadData, isCertifications),
		).toMatchInlineSnapshot(`[]`)
	})

	it('for Terraform, returns a link to the Registry and a Try Cloud item', () => {
		const result = getRightSideNavItems(testTerraformData, isCertifications)
		expect(result).toHaveLength(2)
		expect(result[0]).toMatchObject({
			label: 'Registry',
			opensInNewTab: true,
			url: 'https://registry.terraform.io/',
		})

		// @ts-expect-error icon is always returned in src/components/navigation-header/components/product-page-content/utils/get-nav-items.tsx
		expect(result[0].icon).toBeDefined()
		expect(result[1]).toMatchObject({
			isPrimary: true,
			label: 'Try HCP undefined',
			opensInNewTab: true,
			url: 'https://app.terraform.io/public/signup/account',
		})
	})

	it('for HCP, returns a Try Cloud item', () => {
		const result = getRightSideNavItems(testHCPData, isCertifications)
		expect(result).toHaveLength(1)
		expect(result[0]).toMatchObject({
			isPrimary: true,
			label: 'Try Cloud',
			opensInNewTab: true,
			url: 'https://portal.cloud.hashicorp.com/sign-up',
		})

		// @ts-expect-error icon is always returned
		expect(result[0].icon).toBeDefined()
	})
	it('for Consul, does not return a Try HCP Consul item', () => {
		expect(getRightSideNavItems(testConsulData, isCertifications)).toMatchInlineSnapshot(`[]`)
	})
})
