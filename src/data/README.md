# Product Data

The `src/data/` directory contains all of the product data needed for various views in the app.

## `<product slug>.json`

The `<product slug>.json` files (e.g. `boundary.json`, `consul.json`) contain metadata for each product that is used across multiple views.

### .io sites

TODO - describe the properties used for .io sites

### DevDot

TODO - describe the properties used in DevDot

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

Heading blocks render HTML heading elements. Each block accepts the following properties:

| Property | Type | Details |
| --- | --- | --- |
| `type` | `"heading"` | Block type |
| `heading` | `string` | Text for the heading |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | Semantic heading level, for example `2` becomes `<h2>`. Note that there is already an `<h1>` rendered for the page, so only these values should be used. |
| `size` | `100 \| 200 \| 300 \| 400 \| 500` | Visual size of the heading. `500` is the largest size and `100` is the smallest. Visual size should generally reflect the semantic level, with `h2 = 300`, `h3 = 200`, and `h4` and below at the `100` size.

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
| `product` | `"boundary" \| "consul" \| "nomad" \| "packer" \| "terraform" \| "vault" \| "vagrant" \| "waypoint" \| "sentinel" \| "hcp"` | Product icon to be shown. |
| `heading` | `string` | Text for the heading |
| `text` | `string` | Descriptive text shown below the heading |
| `link` | `{ text: string, url: string }` | `StandaloneLink` shown below the body text |

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
| `icon` | (optional) `"IconBox" \| "IconConsulColor" \| "IconDocs" \| "IconDownload" \| "IconPackerColor" \| "IconProvider" \| "IconServer" \| "IconTerminal" \| "IconTerraformColor" \| "IconVaultColor"` | Optional icon to show at the top of the card. |
| `iconBrandColor` | (optional) `"boundary" \| "consul" \| "nomad" \| "packer" \| "terraform" \| "vault" \| "vagrant" \| "waypoint" \| "neutral" \| "neutral-dark"` | Optional brand color override to apply to the icon. Defaults to the current product context. |
| `heading` | `string` | Text for the card heading |
| `text` | `string` | Text for the card body |
| `url` | `string` | URL to link to |
| `tags` | (optional) `Array<"boundary" \| "consul" \| "nomad" \| "packer" \| "terraform" \| "vagrant" \| "vault" \| "video" \| "waypoint">` | Optional array of tags, to be displayed as icons at the bottom of the card |

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

This file is only used in DevDot. It contains the data and content needed for each product's downloads page (`/boundary/downloads`, `/consul/downloads`, etc.).

**Data Properties**

- [`doesNotHavePackageManagers`](#doesnothavepackagemanagers)
- [`featuredTutorials`](#featuredtutorials)
- [`packageManagerOverrides`](#packagemanageroverrides)
- [`sidecarMarketingCard`](#sidecarmarketingcard)

### `doesNotHavePackageManagers`

This is an optional `boolean` property used for specifying if a product's downloads page should show package managers for each operating system. It only needs to be specified if no package managers need to be shown.

Example usage:

```json
{
  "doesNotHavePackageManagers": true
}
```

### `featuredTutorials`

🚧 The Featured Tutorials section will see update soon with the Learn integration

This is an array of objects. For every object, a `LearnTutorialCard` component (coming soon) will be rendered in a grid of 3 columns or less, depending on the width of the viewport. Each object in the array has three properties:

- `description`: The description of the Tutorial or Collection
- `href`: The URL to the Tutorial or Collection
- `title`: The title of the Tutorial or Collection

### `packageManagerOverrides`

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

### `sidecarMarketingCard`

This is an object for the marketing content located in a `Card` in the Sidecar of the downloads view.

- `title`: The title of the card, shown in a heavier weight font
- `subtitle`: The subtitle of the card, shown in a normal weight font
- `learnMoreLink`: The URL that the "Learn more" `StandaloneLink` points to
- `featuredDocsLinks`: An array of objects with the following properties:
  - `href`: The internal path to a documentation page
  - `label`: The text to show for the link
