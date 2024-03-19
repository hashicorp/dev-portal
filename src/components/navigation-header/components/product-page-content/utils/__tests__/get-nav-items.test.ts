/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getNavItems } from '../get-nav-items'
import { ProductData } from 'types/products'

describe('getNavItems', () => {
	it('for most products, returns the standard set of items', () => {
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
		expect(getNavItems(testNomadData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Install",
		    "url": "/nomad/install",
		  },
		  Object {
		    "label": "Tutorials",
		    "url": "/nomad/tutorials",
		  },
		  Object {
		    "label": "Documentation",
		    "url": "/nomad/docs",
		  },
		  Object {
		    "label": "CLI",
		    "url": "/nomad/commands",
		  },
		  Object {
		    "label": "Integrations",
		    "url": "/nomad/integrations",
		  },
		]
	`)
	})

	it('for Terraform, returns the standard set of items plus a link to the Registry', () => {
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
					name: 'Cloud Docs Agents',
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
					productSlugForLoader: 'ptfe-releases',
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
		expect(getNavItems(testTerraformData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Install",
		    "url": "/terraform/install",
		  },
		  Object {
		    "label": "Tutorials",
		    "url": "/terraform/tutorials",
		  },
		  Object {
		    "iconColorTheme": "terraform",
		    "items": Array [
		      Object {
		        "icon": "docs",
		        "label": "Documentation",
		        "path": "/terraform/docs",
		      },
		      Object {
		        "icon": "file-source",
		        "label": "Configuration Language",
		        "path": "/terraform/language",
		      },
		      Object {
		        "icon": "tools",
		        "label": "CDK for Terraform",
		        "path": "/terraform/cdktf",
		      },
		      Object {
		        "icon": "terminal-screen",
		        "label": "Terraform CLI",
		        "path": "/terraform/cli",
		      },
		      Object {
		        "icon": "cloud",
		        "label": "Terraform Cloud",
		        "path": "/terraform/cloud-docs",
		      },
		      Object {
		        "icon": "enterprise",
		        "label": "Terraform Enterprise",
		        "path": "/terraform/enterprise",
		      },
		      Object {
		        "icon": "provider",
		        "label": "Provider Use",
		        "path": "/terraform/language/providers",
		      },
		      Object {
		        "icon": "plug",
		        "label": "Plugin Development",
		        "path": "/terraform/plugin",
		      },
		      Object {
		        "icon": "database",
		        "label": "Registry Publishing",
		        "path": "/terraform/registry",
		      },
		      Object {
		        "icon": "plus-circle",
		        "label": "Integration Program",
		        "path": "/terraform/docs/partnerships",
		      },
		    ],
		    "label": "Documentation",
		  },
		  Object {
		    "label": "Registry",
		    "opensInNewTab": true,
		    "url": "https://registry.terraform.io/",
		  },
		  Object {
		    "label": "Try Cloud",
		    "opensInNewTab": true,
		    "url": "https://app.terraform.io/public/signup/account",
		  },
		]
	`)
	})

	it('for HCP, returns documentation nav link without dropdown', () => {
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
		expect(getNavItems(testHCPData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Tutorials",
		    "url": "/hcp/tutorials",
		  },
		  Object {
		    "label": "Documentation",
		    "url": "/hcp/docs",
		  },
		  Object {
		    "label": "Try Cloud",
		    "opensInNewTab": true,
		    "url": "https://portal.cloud.hashicorp.com/sign-up",
		  },
		]
	`)
	})
})
