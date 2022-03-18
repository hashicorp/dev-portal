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

TODO - describe the properties used

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
