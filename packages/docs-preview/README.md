## Usage

For local preview, use in the `website` directory of any HashiCorp product repository:

```
npx @hashicorp/docs-preview@docs-preview
```

Also experimenting with a build command, which could potentially be used for PR deploy previews. Note this command must be passed both a `build` and `{product}` argument, in that order, and requires specific configuration on the Vercel side.

```
npx @hashicorp/docs-preview@docs-preview build {product}
```
