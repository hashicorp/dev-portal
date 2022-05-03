/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import s from './product-landing.module.css'
interface ProductLandingProps {
  content: {
    hero: $TSFixMe
    overview: $TSFixMe
    get_started: $TSFixMe
    blocks: $TSFixMe[]
  }
}

function ProductLandingView({ content }: ProductLandingProps): ReactElement {
  return (
    <div>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify({ ...content, blocks: undefined }, null, 2)}
        </code>
      </pre>
      {content.blocks.map((block, idx) => {
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
