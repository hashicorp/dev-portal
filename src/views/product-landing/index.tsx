/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { ProductLandingContent, ProductLandingContentBlock } from './schema'
import s from './product-landing.module.css'

/**
 * TODO: make view-specific types as components are built out
 * (authored content structure and content structure passed to the client
 * will differ; eg tutorial card data will be filled in for client)
 */
interface ProductLandingViewProps {
  content: ProductLandingContent
}

function ProductLandingView({
  content,
}: ProductLandingViewProps): ReactElement {
  return (
    <div>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify({ ...content, blocks: undefined }, null, 2)}
        </code>
      </pre>
      {content.blocks.map((block: ProductLandingContentBlock, idx: number) => {
        const { type } = block
        switch (type) {
          default:
            // If we don't have a recognized card type,
            // return a dev-oriented debug view of the block data
            // TODO: remove this for production, this is here
            // TODO: temporarily as we work through demo-oriented implementation
            return (
              <pre key={idx} className={s.placeholder}>
                <code>{JSON.stringify({ block }, null, 2)}</code>
              </pre>
            )
        }
      })}
    </div>
  )
}

ProductLandingView.layout = SidebarSidecarLayout
export default ProductLandingView
