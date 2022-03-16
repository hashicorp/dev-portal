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
  "heading": "string", // required
  "subheading": "string", // required
  "blocks": [ /*  array of objects, required */ ], 
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

<!-- TODO: update this image -->

![](https://user-images.githubusercontent.com/4624598/155219830-f013d329-2d4c-4186-bd35-e3de495fe83d.png)

</details>

#### `blocks`

Each item in the `blocks` array represents a component on the page. Each of these items must have a `type` property, which can be one of the types listed below.

<!-- block: type heading -->

<details>
<summary>Block type: <code>"heading"</code></summary>

```json5
{
  "type": "heading",
  "level": 2,
  "size": 400,
  "heading": "Explore Waypoint Documentation"
}
```

Result:

<!-- TODO: update this image -->

![](https://user-images.githubusercontent.com/4624598/155219830-f013d329-2d4c-4186-bd35-e3de495fe83d.png)

</details>

<!-- block type: get_started -->

<details>
<summary>Block type: <code>"get_started"</code></summary>

<!-- TODO: add detail here -->

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

Result:

<!-- TODO: update this image -->

![](https://user-images.githubusercontent.com/4624598/155219830-f013d329-2d4c-4186-bd35-e3de495fe83d.png)

</details>

<!-- block type: cards -->

<details>
<summary>Block type: <code>"cards"</code></summary>

<!-- TODO: add detail here -->

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

Result:

<!-- TODO: update this image -->

![](https://user-images.githubusercontent.com/4624598/155219830-f013d329-2d4c-4186-bd35-e3de495fe83d.png)

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
