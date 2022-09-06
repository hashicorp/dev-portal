# HashiCorp Developer: Authorable Content

This folder contains the authorable, marketing-style content for various landing pages in HashiCorp Developer:

- [Sidebar "Resources" section](#1-additional-sidebar-resources-section-navigation-items)
- [Home Page](#2-home-page)
- [Product landing pages](#3-product-landing-pages)
- [Product Docs landing pages](#4-product-docs-landing-pages)
- [Product Install landing pages](#5-product-install-landing-pages)

## 1. Additional Sidebar "Resources" section navigation items

The Sidebar "Resources" section has a number of navigation items automatically generated for each product ([see the `generateResourcesNavItems` Sidebar helper](/src/components/sidebar/helpers/generate-resources-nav-items.ts)). To add _additional_ navigation items to the "Resources" section of the Sidebar:

1. Open the folder of the Product you'd like to make changes for
2. Open (or create) the `additional-sidebar-resources.json` file
3. Reference the next subsection for details on what is authorable

### Editing additional "Resources" navigation items

The `additional-sidebar-resources.json` file should contain a single array. Each item in the array should be an object. Each object should have two properties:

1. `title` (string): This is the text shown for the navigation item.
2. `href` (string): This is the destination of the navigation item. If it is an external link, the Sidebar will automatically render an external link icon to the right of the `title` text.

## 2. Home Page

To change the content for [the Home page](https://developer.hashicorp.com/):

1. Open the `home-page.json` file
2. Reference the next subsection for deatils on what is authorable

### Editing Home Page content

TODO

## 3. Product landing pages

To change the content for Product landing pages (e.g. [/vault](https://developer.hashicorp.com/vault), [/waypoint](https://developer.hashicorp.com/waypoint)):

1. Open the folder of the Product you'd like to make changes for
2. Open the `product-landing.json` file
3. Reference the next subsection for details on what is authorable

### Editing Product landing content

These pages take a "block"-based authoring approach for the main content area. This approach allows authors to write content in JSON instead of JSX. As an overview, each file has three properties, all are required : `heading`, `subheading`, `blocks`. Each of these top-level properties is addressed in more detail below.

<details>
<summary><code>heading</code> and <code>subheading</code></summary>

Source:

```json5
{
	heading: 'Waypoint Documentation',
	subheading: 'Use Waypoint to deliver a PaaS-like experience for Kubernetes, ECS, and other platforms.',
	blocks: [
		/* ... */
	],
}
```

Result:

![](https://user-images.githubusercontent.com/4624598/158818382-e78ea677-85c1-41aa-92b4-ca8714f06f2d.png)

</details>

<details>
<summary><code>blocks</code></summary>

Each item in the `blocks` array represents a component on the page. Each of these items must have a `type` property, which can be one of the types listed below.

<!-- block: type heading -->

<details>
<summary>Block type: <code>"heading"</code></summary>

Heading blocks render HTML heading elements using [our Heading component](../components/heading/index.tsx). Each block accepts the following properties:

| Property  | Type                                                                | Details                                                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`    | `"heading"`                                                         | Block type                                                                                                                                                                                                   |
| `heading` | `string`                                                            | Text for the heading                                                                                                                                                                                         |
| `level`   | [`2 \| 3 \| 4 \| 5 \| 6`](../components/heading/types.ts)           | Semantic heading level, for example `2` becomes `<h2>`. Note that there is already an `<h1>` rendered for the page, so only these values should be used.                                                     |
| `size`    | [`100 \| 200 \| 300 \| 400 \| 500`](../components/heading/types.ts) | Visual size of the heading. `500` is the largest size and `100` is the smallest. Visual size should generally reflect the semantic level, with `h2 = 300`, `h3 = 200`, and `h4` and below at the `100` size. |

Example: `h2` with `300` size:

```json5
{
	type: 'heading',
	heading: 'Featured Reference Docs',
	level: 2,
	size: 300,
}
```

![](https://user-images.githubusercontent.com/4624598/158818745-a20d1892-efa6-4053-9d00-811645d642aa.png)

Example: `h2` with `400` size:

```json5
{
	type: 'heading',
	heading: 'Explore Waypoint Documentation',
	level: 2,
	size: 400,
}
```

![](https://user-images.githubusercontent.com/4624598/158818617-2b8ce029-ad41-4081-8701-869d51abf40b.png)

</details>

<!-- block type: get_started -->

<details>
<summary>Block type: <code>"get_started"</code></summary>

The `"get_started"` block renders a heading, descriptive text, and a single link alongside a product icon.

| Property  | Type                                | Details                                                                               |
| --------- | ----------------------------------- | ------------------------------------------------------------------------------------- |
| `type`    | `"get_started"`                     | Block type                                                                            |
| `product` | [ProductSlug](../types/products.ts) | Product icon to be shown.                                                             |
| `heading` | `string`                            | Text for the heading                                                                  |
| `text`    | `string`                            | Descriptive text shown below the heading                                              |
| `link`    | `{ text: string, url: string }`     | [`StandaloneLink`](../components/standalone-link/index.tsx) shown below the body text |

Example: Waypoint `"get_started"` block

```json5
{
	type: 'get_started',
	product: 'waypoint',
	heading: 'Introduction to Waypoint',
	text: 'Welcome to Waypoint! This introduction section covers what Waypoint is, the problem Waypoint aims to solve, and how Waypoint compares to other software.',
	link: {
		text: 'Get Started',
		url: '/waypoint/docs/intro',
	},
}
```

![](https://user-images.githubusercontent.com/4624598/158821262-03798dca-12e6-487b-ac3e-e8bab51be8b1.png)

</details>

<!-- block type: cards -->

<details>
<summary>Block type: <code>"cards"</code></summary>

The `"cards"` block displays a grid of `CardLink`s, each linked using a single `url`.

| Property  | Type                                                        | Details                                        |
| --------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `type`    | `"cards"`                                                   | Block type                                     |
| `columns` | `2 \| 3`                                                    | The maximum number of columns                  |
| `cards`   | `Array<{ icon, iconBrandColor, heading, text, url, tags }>` | An array of objects, described in detail below |

Each item in the `cards` array has the following structure:

| Property         | Type                                                                    | Details                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`           | (optional) `string`                                                     | Optional icon to show at the top of the card. Must be one of the keys in [the card component's icon dictionary](../views/product-landing/components/cards/icon-dict.js)                                             |
| `iconBrandColor` | (optional) [ProductBrandColor](../components/icon-tile/types.ts) string | Optional brand color override to apply to the icon. Defaults to the current product context.                                                                                                                        |
| `heading`        | `string`                                                                | Text for the card heading                                                                                                                                                                                           |
| `text`           | `string`                                                                | Text for the card body                                                                                                                                                                                              |
| `url`            | `string`                                                                | URL to link to                                                                                                                                                                                                      |
| `tags`           | (optional) `Array<string>`                                              | Optional array of tags, to be displayed as icons at the bottom of the card. Each tag string be one of the keys in [the card component's tag dictionary](../views/product-landing/components/cards/tag-icon-dict.js) |

Example: 2-column cards with icons

```json5
{
	type: 'cards',
	columns: 2,
	cards: [
		{
			icon: 'IconDocs',
			heading: 'Waypoint Reference Documentation',
			text: 'Learn and develop your knowledge of Waypoint with these tutorials and code resources.',
			url: '/waypoint/docs',
		},
		{
			icon: 'IconTerminal',
			heading: 'Waypoint CLI',
			text: 'Waypoint is controlled via a very easy to use command-line interface (CLI).',
			url: '/waypoint/commands',
		},
		{
			icon: 'IconBox',
			heading: 'Waypoint Plugins',
			text: 'Waypoint uses a plugin architecture to provide its build, registry, deploy, and release abilities.',
			url: '/waypoint/plugins',
		},
		{
			icon: 'IconDownload',
			heading: 'Waypoint Downloads',
			text: 'Please download the proper package for your operating system and architecture.',
			url: '/waypoint/downloads',
		},
	],
}
```

![](https://user-images.githubusercontent.com/4624598/158826286-cc94d884-fad7-4d5f-a3f5-52f4b931d7a6.png)

Example: 3-column cards with tags

```json5
{
	type: 'cards',
	columns: 3,
	cards: [
		{
			heading: 'Introduction to Waypoint',
			text: 'Deploying applications in the DevOps landscape can be confusing with so many...',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/tutorials/waypoint/get-started-intro',
		},
		{
			heading: 'Get Started - Kubernetes',
			text: 'Build, deploy, and release applications to a Kubernetes cluster.',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
		},
		{
			heading: 'Get Started - Nomad',
			text: 'Build, deploy, and release applications to a Nomad cluster.',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/collections/waypoint/get-started-nomad',
		},
		{
			heading: 'Get Started - Docker',
			text: 'Start using Waypoint in only a few minutes on a local Docker instance.',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/tutorials/waypoint/get-started-docker',
		},
		{
			heading: 'Deploy an Application to AWS Elastic Container',
			text: 'Run a NodeJS application onto AWS elastic container Service...',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/tutorials/waypoint/aws-ecs',
		},
		{
			heading: 'Deploy an Application to Google Cloud Run',
			text: 'Run an application on Google Cloud Run with Waypoint',
			tags: ['video', 'waypoint'],
			url: 'https://learn.hashicorp.com/tutorials/waypoint/google-cloud-run',
		},
	],
}
```

![](https://user-images.githubusercontent.com/4624598/158826414-e4f7a18c-cfd8-4b8b-bc4e-58e58cb0224d.png)

</details>

</details>

## 4. Product Docs landing pages

To change the content for Product Tutorials landing pages (e.g. [/vault/docs](https://developer.hashicorp.com/vault/docs), [/waypoint/docs](https://developer.hashicorp.com/waypoint/docs)):

1. Open the folder of the Product you'd like to make changes for
2. Open the `docs-landing.json` file
3. Reference the next subsection for details on what is authorable

### Editing Docs landing content

<details>
<summary>🚨 Important Note about <code>mdxSlot</code></summary>

Some products also render MDX content in addition to the content specified in `marketingContentBlocks`. MDX content shows up very last in the page content. It can be authored in the product's repository, in the same file that was previously used to populate the content of these pages.

- For example, Waypoint's MDX content for this page can be edited at: [`hashicorp/waypoint`](hashicorp/waypoint) GitHub repository in the [`website/content/docs/index.mdx` file](https://github.com/hashicorp/waypoint/blob/main/website/content/docs/index.mdx).
- It is also important to note that to enable rendering MDX content in this view, `includeMDXSource: true` must be passed as an option to the `generateGetStaticProps` function exported from [`src/views/product-root-docs-path-landing/server`](/src/views/product-root-docs-path-landing/server.ts). See [`src/pages/waypoint/docs/index`](/src/pages/waypoint/docs/index.tsx) for example of how this is done.

</details>

These files allow the following properties at the top-level: `pageSubtitle` and `marketingContentBlocks`. These are documented below.

<details>
<summary><code>pageSubtitle</code></summary>

The `pageSubtitle` property is used to customize the text beneath the page title.

- The page title is automatically generated and reads "${ProductName} Documentation", for example: "Waypoint Documentation".
- The page title and subtitle are both placed to the right of an [`IconTileLogo`](https://developer.hashicorp.com/swingset/components/icontilelogo). This is something to be mindful of when determining the character length of the subtitle.

The following configuration:

```json
{
	"pageSubtitle": "Learn and develop your knowledge of Waypoint with these tutorials and code resources."
}
```

Outputs the following:

![Full window screenshot showing the example `pageSubtitle` text beneath the page heading.](/docs/images/ProductRootDocsPathLanding-pageSubtitle.png)

</details>

<details>
<summary><code>marketingContentBlocks</code></summary>

This property is an array of objects. Each object has properties that express what type of content block should be rendered. There are currently three types of blocks for this view. Listed in alphabetical order:

<!-- START OF card-grid DESCRIPTION -->

<details>
<summary>the <code>card-grid</code> block type</summary>

The `card-grid` block type handles rendering two things:

1. a grid of clickable cards
2. a heading element that labels the grid of cards

A `card-grid` block has three properties: `title`, `description`, and `cards`.

- `title` (required): plain text that will be rendered inside of a heading element. The level of the heading element will be automatically generated based on other blocks defined in `marketingContentBlocks`.
- `description` (optional): plain text to show after the heading element and before the grid of cards.
- `cards` (required): an array of objects. Each object must have the following properties:
  - `title`: plain text used to label a card with bold text.
  - `description`: plain text used to describe the linked content. This text is automatically ellipsed to take up a maxium of 3-lines.
  - `url`: where the user will be taken when they click the card.

The following configuration:

```json
{
	"marketingContentBlocks": [
		{
			"type": "card-grid",
			"title": "Secrets Management",
			"description": "Centrally store, access, and deploy secrets across applications, systems, and infrastructure.",
			"cards": [
				{
					"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
					"title": "KV Secrets Engine",
					"url": "/vault/docs/secrets/kv"
				},
				{
					"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
					"title": "Database Credentials",
					"url": "/vault/docs/secrets/databases"
				},
				{
					"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
					"title": "Kubernetes Secrets",
					"url": "/vault/tutorials/kubernetes"
				}
			]
		}
	]
}
```

Will output the following:

![Zoomed in view of a `card-grid` block. The first row is a heading element that reads "Secrets Management". The second row is body text that reads "Centrally store, access, and deploy secrets across applications, systems, and infrastructure." The third row shows 3 cards. Each card has a bold title: "Kv Secrets Engine", "Database Credentials", and "Kubernetes Secrets". Below each card title is lorem-ipsum body text with ellipses at the end of the third line of content.](/docs/images/ProductRootDocsPathLanding-marketingContentBlocks-card-grid.png)

</details>

<!-- END OF card-grid DESCRIPTION -->

<!-- START OF icon-card-grid DESCRIPTION -->

<details>
<summary>the <code>icon-card-grid</code> block type</summary>

The `icon-card-grid` block type is similar to the `card-grid` block type in that it renders a grid of clickable cards. The `icon-card-grid` block does not have a `title` property for rendering a heading element, and the main difference between the two blocks is the content rendered in the cards.

An `icon-card-grid` block has one property:

- `cards` (required): an array of objects. Each object must have the following properties:
  - `iconName`: the string name for a Flight icon. The icons currently supported in this block can be found in [the `supported-icons.tsx` file](./components/supported-icons.tsx) All icon names can be found at [flight-hashicorp.vercel.app](https://flight-hashicorp.vercel.app/).
  - `text`: a brief string labeling the card.
  - `url`: where the user will be taken when the click the card.

The following configuration:

```json
{
  "type": "section-heading",
  "title": "Developers"
},
{
  "type": "icon-card-grid",
  "cards": [
    {
      "iconName": "guide",
      "text": "Client Libraries",
      "url": "/vault/api-docs/libraries"
    },
    {
      "iconName": "tools",
      "text": "API Reference",
      "url": "/vault/api-docs"
    },
    {
      "iconName": "connection",
      "text": "Sample Integrations",
      "url": "https://github.com/hashicorp/hello-vault-go"
    },
    {
      "iconName": "terminal",
      "text": "Code Samples",
      "url": "https://github.com/hashicorp/vault-examples"
    }
  ]
}
```

Will output the following:

![](/docs/images/ProductRootDocsPathLanding-marketingContentBlocks-icon-card-grid.png)

</details>

<!-- END OF icon-card-grid DESCRIPTION -->

<!-- START OF section-heading DESCRIPTION -->

<details>
<summary>the <code>section-heading</code> block type</summary>

The `section-heading` content block always renders an `<h2>` element. It should be used to label a new section of content. There is currently only one property to provide for this block:

- `title`: the text to place in the rendered `h2` element.

Notes on intended usage:

- Since the `card-grid` block has a heading element built in to its configuration, it is not necessary to use a `section-heading` with a singular `card-grid` block.
- If there are multiple, related `card-grid` blocks being rendered in a group, the group can be labeled with a single `section-heading` block. The heading elements rendered for the `card-grid` blocks will be automatically determined to be `<h3>` elements.

Example usage:

```json
{
	"type": "section-heading",
	"title": "Developers"
}
```

</details>

<!-- END OF section-heading DESCRIPTION -->

</details>

## 5. Product Install landing pages

To change the content for Product Install landing pages (e.g. [/vault/downloads](https://developer.hashicorp.com/vault/downloads), [/waypoint/downloads](https://developer.hashicorp.com/waypoint/downloads)):

1. Open the folder of the Product you'd like to make changes for
2. Open the `install-landing.json` file
3. Reference the next subsection for details on what is authorable

### Editing Install landing content

These are the possible properties that product install landing views accept:

- `doesNotHavePackageManagers`
- `featuredCollectionsSlugs`
- `featuredTutorialsSlugs`
- `packageManagerOverrides`
- `sidebarMenuItems`
- `sidecarMarketingCard`

Each property is described in each following expandable section.

<!-- doesNotHavePackageManagers -->

<details>
<summary><code>doesNotHavePackageManagers</code></summary>

This is an optional `boolean` property used for specifying if a product's downloads page should show package managers for each operating system. It only needs to be specified if no package managers need to be shown.

Example usage:

```json
{
	"doesNotHavePackageManagers": true
}
```

</details>

<!-- featuredCollectionSlugs -->

<details>
<summary><code>featuredCollectionSlugs</code></summary>

Use this property to display a grid of Collection cards under a heading that reads "Featured Collections".

The following configuration:

```json
{
	"featuredCollectionSlugs": [
		"terraform/aws-get-started",
		"terraform/azure-get-started",
		"terraform/docker-get-started",
		"terraform/gcp-get-started",
		"terraform/oci-get-started",
		"terraform/cloud-get-started"
	]
}
```

Outputs the following:

![Dark, bold "Featured Collections" heading above a 3-column by 2-row grid of 6 Collection cards.](/docs/images/ProductDownloadsView-featuredCollectionsSlugs.png)

</details>

<!-- featuredTutorialsSlugs -->

<details>
<summary><code>featuredTutorialsSlugs</code></summary>

Use this property to display a grid of Tutorial cards under a heading that reads "Featured Tutorials".

There are two accepted formats for the slugs:

- `:productSlug/:tutorialSlug`: If you'd like to link to the tutorial's default collection, use this shorter slug format.
- `:productSlug/:collectionSlug/:tutorialSlug`: If you'd like to link to the tutorial in a collection that is not its default, use this longer slug format. **The order of the slugs matters.**

Either slug format is allowed in the `featuredTutorialsSlugs` array. A mix of both formats within the same array is also allowed.

The following configuration:

```json
{
	"featuredTutorialsSlugs": [
		"waypoint/get-started-intro",
		"waypoint/get-started-kubernetes/get-started-install",
		"waypoint/get-started-nomad",
		"waypoint/aws-ecs",
		"waypoint/azure-container-instance",
		"waypoint/google-cloud-run"
	]
}
```

Outputs the following:

![Dark, bold "Featured Tutorials" heading above a 3-column by 2-row grid of 6 Tutorial cards.](/docs/images/ProductDownloadsView-featuredTutorialsSlugs.png)

</details>

<!-- packageManagerOverrides -->

<details>
<summary><code>packageManagerOverrides</code></summary>

This is an array of objects. There is a default list of package managers that is shown for every product (see the `generateDefaultPackageManagers` helper in [`ProductDownloadsView`](../views/product-downloads-view/helpers.ts)). This property can be used to override any of the default package managers based on the `os` and `label` properties provided.

Example usage showing an override for macOS Homebrew:

```json
{
	"packageManagerOverrides": [
		{
			"label": "Homebrew",
			"commands": ["brew install vagrant"],
			"os": "darwin"
		}
	]
}
```

</details>

<!-- sidebarMenuItems -->

<details>
<summary><code>sidebarMenuItems</code></summary>

To populate the Sidebar with navigation items under the Sidebar title, use the `sidebarMenuItems` property. It is an array of objects with shapes that match the shape of objects accepted as nav data in documentation content. The submenu navigation items are not currently recommended in this Sidebar, just dividers, headings, and link navigation items.

The following configuration:

```json
{
	"sidebarMenuItems": [
		{
			"divider": true
		},
		{
			"heading": "Getting Started"
		},
		{
			"title": "Introduction to Terraform",
			"fullPath": "/terraform/intro"
		},
		{
			"title": "Get Started with Terraform Cloud",
			"fullPath": "/terraform/tutorials/cloud-get-started/cloud-sign-up"
		}
	]
}
```

Will output the following Sidebar between the auto-generated content in the header & footer:

![Vertical list of Sidebar navigation items: "Terraform Home" back-to link, "Install Terraform" heading, horizontal divider, "Getting Started" heading, "Introduction to Terraform" link item, "Get Started with Terraform Cloud" link item.](/docs/images/ProductDownloadsView-sidebarMenuItems.png)

</details>

<!-- sidecarMarketingCard -->

<details>
<summary><code>sidecarMarketingCard</code></summary>

This is an object for the marketing content located in a `Card` in the Sidecar of the downloads view.

- `title`: The title of the card, shown in a heavier weight font
- `subtitle`: The subtitle of the card, shown in a normal weight font
- `featuredDocsLinks`: An array of objects with the following properties:
  - `href`: The internal path to a documentation page
  - `label`: The text to show for the link

</details>
