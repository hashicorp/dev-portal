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

TODO - describe the properties used

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
