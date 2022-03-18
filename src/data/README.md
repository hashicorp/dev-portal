# Product Data

The `src/data/` directory contains all of the product data needed for various views in the app.

## `<product slug>.json`

The `<product slug>.json` files (e.g. `boundary.json`, `consul.json`) contain metadata for each product that is used across multiple views, including their .io site and Dev Portal pages.

### .io properties

The canonical list of options (including a brief description of their usage) can be found in the [type definition for `ProductData`](./types.d.ts).

### DevDot properties

<!-- name -->

<details>
<summary><code>name</code></summary>

This is the human-readable, proper noun name of a product. It is used for displaying the name of a product in various parts of DevDot. It is one of two properties required in the `product` object that should be provided as a prop for every DevDot page component that uses `ProductSwitcher`. The other required property is `slug`, which is described next.

See the `ProductName` type defined in [`types/products.ts`](/src/types/products.ts) for all possible values.

</details>

<!-- slug -->

<details>
<summary><code>slug</code></summary>

This is the machine-readable version of a product's name. It is considered the unique ID for each product, which enables customizing behavior by product (see [ProductIcon](/src/components/product-icon/index.tsx) for example). It is the second of two properties required in the `product` object that should be provided as a prop for every DevDot page component that uses `ProductSwitcher`.

See the `ProductSlug` type defined in [`types/products.ts`](/src/types/products.ts) for all possible values.

</details>

<!-- basePaths -->

<details>
<summary><code>basePaths</code></summary>

This is an array of strings representing all of the base documentation paths for a product. This array is used in when [preparing data for the sidebar](/src/layouts/sidebar-sidecar/utils/prepare-nav-data-for-client.ts), [adjusting `href`s client-size in `DocsAnchor`](/src/components/docs-anchor/index.tsx), and [adjusting URLs server-side with remark](/src/layouts/sidebar-sidecar/utils/product-url-adjusters.ts).

See the type for this property defined in [`types/products.ts`](/src/types/products.ts).

</details>

<!-- sidebar -->

<details>
<summary><code>sidebar</code></summary>

This is an object with two properties at the time of writing. Both of these arrays contain `MenuItem` objects (defined in [`components/sidebar/types.ts`](/src/components/sidebar/types.ts)).

- `landingPageNavData`: this is an array of items to show in the top of the sidebar in a product's landing page (`/boundary`, `/consul`, etc.).
- `resourcesNavData`: this is an array of items that represents the "Resources" section for a product that is shown at the bottom of the sidebar in many different pages for the product.

How to add different types of items:

- To insert an internal link item, provide an object with the `fullPath` and `title` properties. Example:

  ```json
  {
    "title": "Introduction",
    "fullPath": "/waypoint/docs/intro"
  }
  ```

- To insert an external link item (an external link icon is rendered next to it), provide an object with the `href` and `title` properties. Example:

  ```json
  {
    "title": "Releases",
    "href": "https://releases.hashicorp.com/waypoint/"
  }
  ```

- To insert a heading in one of these arrays, an object with only a `heading` property is required. Example:

  ```json
  { "heading": "Resources" }
  ```

- To insert a horizontal divider in one of these arrays, the following object should be used:

  ```json
  { "divider": true }
  ```

</details>

<!-- navigationHeaderItems -->

<details>
<summary><code>navigationHeaderItems</code></summary>

This is an array of objects used to populate the main navigation header at the top of every page for a product.

See the `NavigationHeaderItem` interface defined in [`components/navigation-header/types.ts`](/src/components/navigation-header/types.ts) for details on the properties needed for each object in the array.

</details>

## `<product slug>-landing.json`

This file is only used in DevDot. It contains the data and content needed for each product's landing page (`/boundary`, `/consul`, etc.).

### Editing product landing content

Our `<product slug>-landing.json` pages take a "block"-based authoring approach for the main content area. This approach allows authors to write content in JSON instead of JSX. As an overview, each file has three properties, all are required:

```json5
{
  "heading": "string",
  "subheading": "string",
  "blocks": [ /* array of objects */ ], 
}
```

Each of these top-level properties is addressed in more detail below.

#### `heading` and `subheading`

Set the heading and subheading shown on the page.

<details>
<summary>Example</summary>

Source: 

```json5
{
  "heading": "Waypoint Documentation", 
  "subheading": "Use Waypoint to deliver a PaaS-like experience for Kubernetes, ECS, and other platforms.", 
  "blocks": [ /* ... */ ],
}
```

Result:

![](https://user-images.githubusercontent.com/4624598/158818382-e78ea677-85c1-41aa-92b4-ca8714f06f2d.png)

</details>

#### `blocks`

Each item in the `blocks` array represents a component on the page. Each of these items must have a `type` property, which can be one of the types listed below.

<!-- block: type heading -->

<details>
<summary>Block type: <code>"heading"</code></summary>

Heading blocks render HTML heading elements using [our Heading component](../components/heading/index.tsx). Each block accepts the following properties:

| Property | Type | Details |
| --- | --- | --- |
| `type` | `"heading"` | Block type |
| `heading` | `string` | Text for the heading |
| `level` | [`2 \| 3 \| 4 \| 5 \| 6`](../components/heading/types.ts) | Semantic heading level, for example `2` becomes `<h2>`. Note that there is already an `<h1>` rendered for the page, so only these values should be used. |
| `size` | [`100 \| 200 \| 300 \| 400 \| 500`](../components/heading/types.ts) | Visual size of the heading. `500` is the largest size and `100` is the smallest. Visual size should generally reflect the semantic level, with `h2 = 300`, `h3 = 200`, and `h4` and below at the `100` size.

Example: `h2` with `300` size:

```json5
{
  "type": "heading",
  "heading": "Featured Reference Docs",
  "level": 2,
  "size": 300,
}
```

![](https://user-images.githubusercontent.com/4624598/158818745-a20d1892-efa6-4053-9d00-811645d642aa.png)

Example: `h2` with `400` size:

```json5
{
  "type": "heading",
  "heading": "Explore Waypoint Documentation",
  "level": 2,
  "size": 400,
}
```

![](https://user-images.githubusercontent.com/4624598/158818617-2b8ce029-ad41-4081-8701-869d51abf40b.png)

</details>

<!-- block type: get_started -->

<details>
<summary>Block type: <code>"get_started"</code></summary>

The `"get_started"` block renders a heading, descriptive text, and a single link alongside a product icon.

| Property | Type | Details |
| --- | --- | --- |
| `type` | `"get_started"` | Block type |
| `product` | [ProductSlug](../types/products.ts) | Product icon to be shown. |
| `heading` | `string` | Text for the heading |
| `text` | `string` | Descriptive text shown below the heading |
| `link` | `{ text: string, url: string }` | [`StandaloneLink`](../components/standalone-link/index.tsx) shown below the body text |

Example: Waypoint `"get_started"` block

```json5
{
  "type": "get_started",
  "product": "waypoint",
  "heading": "Introduction to Waypoint",
  "text": "Welcome to Waypoint! This introduction section covers what Waypoint is, the problem Waypoint aims to solve, and how Waypoint compares to other software.",
  "link": {
    "text": "Get Started",
    "url": "/waypoint/docs/intro"
  }
}
```

![](https://user-images.githubusercontent.com/4624598/158821262-03798dca-12e6-487b-ac3e-e8bab51be8b1.png)

</details>

<!-- block type: cards -->

<details>
<summary>Block type: <code>"cards"</code></summary>

The `"cards"` block displays a grid of `CardLink`s, each linked using a single `url`.

| Property | Type | Details |
| --- | --- | --- |
| `type` | `"cards"` | Block type |
| `columns` | `2 \| 3` | The maximum number of columns |
| `cards` | `Array<{ icon, iconBrandColor, heading, text, url, tags }>` | An array of objects, described in detail below |

Each item in the `cards` array has the following structure:

| Property | Type | Details |
| --- | --- | --- |
| `icon` | (optional) `string` | Optional icon to show at the top of the card. Must be one of the keys in [the card component's icon dictionary](../views/product-landing/components/cards/icon-dict.js) |
| `iconBrandColor` | (optional) [ProductBrandColor](../components/icon-tile/types.ts) string | Optional brand color override to apply to the icon. Defaults to the current product context. |
| `heading` | `string` | Text for the card heading |
| `text` | `string` | Text for the card body |
| `url` | `string` | URL to link to |
| `tags` | (optional) `Array<string>` | Optional array of tags, to be displayed as icons at the bottom of the card. Each tag string be one of the keys in [the card component's tag dictionary](../views/product-landing/components/cards/tag-icon-dict.js) |

Example: 2-column cards with icons

```json5
{
  "type": "cards",
  "columns": 2,
  "cards": [
    {
      "icon": "IconDocs",
      "heading": "Waypoint Reference Documentation",
      "text": "Learn and develop your knowledge of Waypoint with these tutorials and code resources.",
      "url": "/waypoint/docs"
    },
    {
      "icon": "IconTerminal",
      "heading": "Waypoint CLI",
      "text": "Waypoint is controlled via a very easy to use command-line interface (CLI).",
      "url": "/waypoint/commands"
    },
    {
      "icon": "IconBox",
      "heading": "Waypoint Plugins",
      "text": "Waypoint uses a plugin architecture to provide its build, registry, deploy, and release abilities.",
      "url": "/waypoint/plugins"
    },
    {
      "icon": "IconDownload",
      "heading": "Waypoint Downloads",
      "text": "Please download the proper package for your operating system and architecture.",
      "url": "/waypoint/downloads"
    }
  ]
}
```

![](https://user-images.githubusercontent.com/4624598/158826286-cc94d884-fad7-4d5f-a3f5-52f4b931d7a6.png)

Example: 3-column cards with tags

```json5
{
  "type": "cards",
  "columns": 3,
  "cards": [
    {
      "heading": "Introduction to Waypoint",
      "text": "Deploying applications in the DevOps landscape can be confusing with so many...",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/tutorials/waypoint/get-started-intro"
    },
    {
      "heading": "Get Started - Kubernetes",
      "text": "Build, deploy, and release applications to a Kubernetes cluster.",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes"
    },
    {
      "heading": "Get Started - Nomad",
      "text": "Build, deploy, and release applications to a Nomad cluster.",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/collections/waypoint/get-started-nomad"
    },
    {
      "heading": "Get Started - Docker",
      "text": "Start using Waypoint in only a few minutes on a local Docker instance.",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/tutorials/waypoint/get-started-docker"
    },
    {
      "heading": "Deploy an Application to AWS Elastic Container",
      "text": "Run a NodeJS application onto AWS elastic container Service...",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/tutorials/waypoint/aws-ecs"
    },
    {
      "heading": "Deploy an Application to Google Cloud Run",
      "text": "Run an application on Google Cloud Run with Waypoint",
      "tags": ["video", "waypoint"],
      "url": "https://learn.hashicorp.com/tutorials/waypoint/google-cloud-run"
    }
  ]
}
```

![](https://user-images.githubusercontent.com/4624598/158826414-e4f7a18c-cfd8-4b8b-bc4e-58e58cb0224d.png)

</details>

## `<product slug>-install.json`

This file is only used in DevDot. It contains the data and content needed for each product's downloads page (`/boundary/downloads`, `/consul/downloads`, etc.). There are four possible data properties that can be provided at the highest level: `doesNotHavePackageManagers`, `featuredTutorials`, `packageManagerOverrides`, and `sidebarMarketingCard`.

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

<!-- featuredTutorials -->

<details>
<summary><code>featuredTutorials</code></summary>

🚧 The Featured Tutorials section will see update soon with the Learn integration

This is an array of objects. For every object, a `LearnTutorialCard` component (coming soon) will be rendered in a grid of 3 columns or less, depending on the width of the viewport. Each object in the array has three properties:

- `description`: The description of the Tutorial or Collection
- `href`: The URL to the Tutorial or Collection
- `title`: The title of the Tutorial or Collection

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

<!-- sidecarMarketingCard -->

<details>
<summary><code>sidecarMarketingCard</code></summary>

This is an object for the marketing content located in a `Card` in the Sidecar of the downloads view.

- `title`: The title of the card, shown in a heavier weight font
- `subtitle`: The subtitle of the card, shown in a normal weight font
- `learnMoreLink`: The URL that the "Learn more" `StandaloneLink` points to
- `featuredDocsLinks`: An array of objects with the following properties:
  - `href`: The internal path to a documentation page
  - `label`: The text to show for the link

</details>
