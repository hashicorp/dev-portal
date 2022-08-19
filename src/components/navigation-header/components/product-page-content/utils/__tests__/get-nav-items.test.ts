import waypointProductData from 'data/waypoint.json'
import terraformProductData from 'data/terraform.json'
import { getNavItems } from '../get-nav-items'
import { ProductData } from 'types/products'

describe('getNavItems', () => {
	it('for most products, returns the standard set of items', () => {
		const productData = waypointProductData as ProductData
		expect(getNavItems(productData)).toMatchInlineSnapshot(`
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
		const productData = terraformProductData as ProductData
		expect(getNavItems(productData)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "label": "Home",
		    "url": "/terraform",
		  },
		  Object {
		    "iconColorTheme": "terraform",
		    "items": Array [
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
		        "icon": "cloud",
		        "label": "Cloud Docs Agents",
		        "path": "/terraform/cloud-docs/agents",
		      },
		      Object {
		        "icon": "docs",
		        "label": "General Documentation",
		        "path": "/terraform/docs",
		      },
		      Object {
		        "icon": "enterprise",
		        "label": "Terraform Enterprise",
		        "path": "/terraform/enterprise",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Internals",
		        "path": "/terraform/internals",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Intro",
		        "path": "/terraform/intro",
		      },
		      Object {
		        "icon": "file-source",
		        "label": "Configuration Language",
		        "path": "/terraform/language",
		      },
		      Object {
		        "icon": "plug",
		        "label": "Plugin Development",
		        "path": "/terraform/plugin",
		      },
		      Object {
		        "icon": "plug",
		        "label": "Framework",
		        "path": "/terraform/plugin/framework",
		      },
		      Object {
		        "icon": "plug",
		        "label": "Log",
		        "path": "/terraform/plugin/log",
		      },
		      Object {
		        "icon": "plug",
		        "label": "mux",
		        "path": "/terraform/plugin/mux",
		      },
		      Object {
		        "icon": "plug",
		        "label": "SDKv2",
		        "path": "/terraform/plugin/sdkv2",
		      },
		      Object {
		        "icon": "database",
		        "label": "Registry Publishing",
		        "path": "/terraform/registry",
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
