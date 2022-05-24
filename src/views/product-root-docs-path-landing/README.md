# `ProductRootDocsPathLanding` View

## Authoring Content

The content for each `/${productSlug}/docs` page lives in a `content.json` file in each `src/pages/${productSlug}/docs/` folder. For example:

- [`content.json` file for `/waypoint/docs`](/src/pages/waypoint/docs/content.json)
- [`content.json` file for `/vault/docs`](/src/pages/vault/docs/content.json)

These files allow the following properties at the top-level

### `pageSubtitle`

The `pageSubtitle` property is used to customize the text beneath the page title.

- The page title is automatically generated and reads "${ProductName} Documentation", for example: "Waypoint Documentation".
- The page title and subtitle are both placed to the right of an [`IconTileLogo`](https://developer.hashicorp.com/swingset/components/icontilelogo). This is something to be mindful of when determining the character length of the subtitle.

<details>
<summary>Example</summary>

The following configuration:

```json
{
  "pageSubtitle": "Learn and develop your knowledge of Waypoint with these tutorials and code resources."
}
```

Outputs the following:

![Full window screenshot showing the example `pageSubtitle` text beneath the page heading.](/docs/images/ProductRootDocsPathLanding-pageSubtitle.png)

</details>

### `marketingContentBlocks`

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
