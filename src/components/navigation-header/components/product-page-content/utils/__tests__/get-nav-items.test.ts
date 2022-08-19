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
		    "type": "link",
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
		    "type": "submenu",
		  },
		  Object {
		    "label": "Tutorials",
		    "type": "link",
		    "url": "/waypoint/tutorials",
		  },
		  Object {
		    "label": "Install",
		    "type": "link",
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
		    "type": "link",
		    "url": "/terraform",
		  },
		  Object {
		    "iconColorTheme": "terraform",
		    "items": Array [
		      Object {
		        "icon": "docs",
		        "label": "CDKTF",
		        "path": "/terraform/cdktf",
		      },
		      Object {
		        "icon": "docs",
		        "label": "CLI",
		        "path": "/terraform/cli",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Cloud Docs",
		        "path": "/terraform/cloud-docs",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Cloud Docs Agents",
		        "path": "/terraform/cloud-docs/agents",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Docs",
		        "path": "/terraform/docs",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Enterprise",
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
		        "icon": "docs",
		        "label": "Language",
		        "path": "/terraform/language",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Plugin Development",
		        "path": "/terraform/plugin",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Plugin Framework",
		        "path": "/terraform/plugin/framework",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Plugin Log",
		        "path": "/terraform/plugin/log",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Plugin mux",
		        "path": "/terraform/plugin/mux",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Plugin sdkv2",
		        "path": "/terraform/plugin/sdkv2",
		      },
		      Object {
		        "icon": "docs",
		        "label": "Registry",
		        "path": "/terraform/registry",
		      },
		    ],
		    "label": "Documentation",
		    "type": "submenu",
		  },
		  Object {
		    "label": "Tutorials",
		    "type": "link",
		    "url": "/terraform/tutorials",
		  },
		  Object {
		    "label": "Install",
		    "type": "link",
		    "url": "/terraform/downloads",
		  },
		  Object {
		    "label": "Registry",
		    "type": "link",
		    "url": "https://registry.terraform.io/",
		  },
		]
	`)
	})
})
