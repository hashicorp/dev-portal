import Columns from 'components/author-primitives/vault/columns'
import InlineTag from 'components/author-primitives/vault/inline-tag'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import DocsAnchor from 'components/docs-anchor'
import defaultMdxComponents from '@hashicorp/platform-docs-mdx'

// Asana task to discuss MDX custom components in dev-portal:
// https://app.asana.com/0/1100423001970639/1201648132084613/f

const vaultMdxComponents = defaultMdxComponents({
  // TODO: we should be able to remove the need for product here,
  // TODO: using our existing useProductMeta utility:
  // TODO: ref: https://github.com/hashicorp/web-platform-packages/tree/main/packages/product-meta#productmetaprovider
  // TODO: The only piece of our MDX defaults using product
  // TODO: is EnterpriseAlert, which rather than requiring a
  // TODO: "product" prop, should useProductMeta
  // TODO: ref: https://github.com/hashicorp/web-platform-packages/blob/6062939845d5d841d78afade8225e891cd428aa3/packages/docs-mdx/index.jsx#L42
  product: 'vault',
  additionalComponents: {
    Columns,
    Tag: InlineTag,
    a: DocsAnchor,
  },
})

const waypointMdxComponents = defaultMdxComponents({
  product: 'waypoint',
  additionalComponents: {
    Placement,
    NestedNode,
    a: DocsAnchor,
  },
})

export { vaultMdxComponents, waypointMdxComponents }
// eslint-disable-next-line import/no-anonymous-default-export
export default { vaultMdxComponents, waypointMdxComponents }
