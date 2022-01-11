import Columns from 'components/author-primitives/vault/columns'
import InlineTag from 'components/author-primitives/vault/inline-tag'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'
import makeDocsAnchor from 'components/docs-anchor'
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
    // TODO: apply makeDocsAnchor as a remark plugin instead?
    // TODO: combined with above change, this could allow us
    // TODO: to use a shared set of base components for all products,
    // TODO: and only need to pass additionalComponents, on a per-route
    // TODO: basis. (eg Columns & Tags are only needed on /vault/docs,
    // TODO: not /vault/api-docs, and in fact are only needed on
    // TODO: a single page - /vault/docs/plugin-portal.)
    // TODO: Longer-term, we may be able to deprecate some MDX components...
    // TODO: although this will admittedly be pretty difficult, since
    // TODO: we need to support all past versions of documentation!
    a: makeDocsAnchor('vault', ['docs', 'api-docs']),
  },
})

const waypointMdxComponents = defaultMdxComponents({
  product: 'waypoint',
  additionalComponents: {
    Placement,
    NestedNode,
    a: makeDocsAnchor('waypoint', ['docs', 'plugins', 'commands']),
  },
})

export { vaultMdxComponents, waypointMdxComponents }
// eslint-disable-next-line import/no-anonymous-default-export
export default { vaultMdxComponents, waypointMdxComponents }
