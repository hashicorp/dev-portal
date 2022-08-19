import { getNavItems } from '../get-nav-items'
import { ProductData } from 'types/products'

describe('getNavItems', () => {
	it('for most products, returns the standard set of items', () => {
		const testWaypointData = {
			slug: 'waypoint',
			rootDocsPaths: [
				{
					iconName: 'docs',
					name: 'General Documentation',
					path: 'docs',
					shortName: 'Documentation',
					includeMDXSource: true,
				},
				{
					iconName: 'terminal-screen',
					name: 'CLI',
					path: 'commands',
				},
				{
					iconName: 'plug',
					name: 'Plugins',
					path: 'plugins',
				},
			],
		} as ProductData
		expect(getNavItems(testWaypointData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Home",
		    "url": "/waypoint",
		  },
		  Object {
		    "iconColorTheme": "waypoint",
		    "items": Array [
		      Object {
		        "icon": "docs",
		        "label": "General Documentation",
		        "path": "/waypoint/docs",
		      },
		      Object {
		        "icon": "terminal-screen",
		        "label": "CLI",
		        "path": "/waypoint/commands",
		      },
		      Object {
		        "icon": "plug",
		        "label": "Plugins",
		        "path": "/waypoint/plugins",
		      },
		    ],
		    "label": "Documentation",
		  },
		  Object {
		    "label": "Tutorials",
		    "url": "/waypoint/tutorials",
		  },
		  Object {
		    "label": "Install",
		    "url": "/waypoint/downloads",
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
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'terminal-screen',
					name: 'Terraform CLI',
					path: 'cli',
					addOverviewItem: false,
				},
				{
					iconName: 'cloud',
					name: 'Terraform Cloud',
					path: 'cloud-docs',
					productSlugForLoader: 'terraform-docs-common',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'cloud',
					name: 'Cloud Docs Agents',
					navDataPrefix: 'cloud-docs-agents',
					path: 'cloud-docs/agents',
					productSlugForLoader: 'terraform-docs-agents',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'docs',
					name: 'General Documentation',
					path: 'docs',
					productSlugForLoader: 'terraform-docs-common',
				},
				{
					iconName: 'enterprise',
					name: 'Terraform Enterprise',
					path: 'enterprise',
					productSlugForLoader: 'ptfe-releases',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'docs',
					name: 'Internals',
					path: 'internals',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'docs',
					name: 'Intro',
					path: 'intro',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'file-source',
					name: 'Configuration Language',
					path: 'language',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'plug',
					name: 'Plugin Development',
					path: 'plugin',
					productSlugForLoader: 'terraform-docs-common',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'plug',
					name: 'Framework',
					navDataPrefix: 'plugin-framework',
					path: 'plugin/framework',
					productSlugForLoader: 'terraform-plugin-framework',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'plug',
					name: 'Log',
					navDataPrefix: 'plugin-log',
					path: 'plugin/log',
					productSlugForLoader: 'terraform-plugin-log',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'plug',
					name: 'mux',
					navDataPrefix: 'plugin-mux',
					path: 'plugin/mux',
					productSlugForLoader: 'terraform-plugin-mux',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'plug',
					name: 'SDKv2',
					path: 'plugin/sdkv2',
					productSlugForLoader: 'terraform-plugin-sdk',
					navDataPrefix: 'plugin-sdk',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
				{
					iconName: 'database',
					name: 'Registry Publishing',
					path: 'registry',
					productSlugForLoader: 'terraform-docs-common',
					visuallyHideSidebarTitle: true,
					addOverviewItem: false,
				},
			],
		} as ProductData
		expect(getNavItems(testTerraformData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Home",
		    "url": "/terraform",
		  },
		  Object {
		    "iconColorTheme": "terraform",
		    "items": Array [
		      Object {
		        "icon": "docs",
		        "label": "General Documentation",
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
		    "label": "Tutorials",
		    "url": "/terraform/tutorials",
		  },
		  Object {
		    "label": "Install",
		    "url": "/terraform/downloads",
		  },
		  Object {
		    "label": "Registry",
		    "openInNewTab": true,
		    "url": "https://registry.terraform.io/",
		  },
		]
	`)
	})
})
