# Product Data

The `src/data/` directory contains all of the product data needed for various views in the app. The `<product slug>.json` files (e.g. `boundary.json`, `consul.json`) contain metadata for each product that is used across multiple views. The metadata for .io sites is in the web monorepo. For example, Terraform metadata is in [terraform-io/src/data/terraform.ts](https://github.com/hashicorp/web/blob/main/apps/terraform-io/src/data/terraform.ts)

## .io properties

The canonical list of options (including a brief description of their usage) can be found in the [type definition for `ProductData`](./types.d.ts).

## DevDot properties

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

🚧 DEPRECATED - this property is being replaced by the `rootDocsPaths` property. The new property is detailed in the next section. 🚧

</details>

<!-- rootDocsPaths -->

<details>
<summary><code>rootDocsPaths</code></summary>

This is an array of objects. Each object represents a "root docs path", or a section of documentation for a product. For example, Consul has 3 root docs paths: `/consul/commands`, `/consul/docs`, and `/consul/api-docs`. Each object stores metadata for a root docs path.

See the `RootDocsPath` interface for this property defined in [`types/products.ts`](/src/types/products.ts).

</details>
