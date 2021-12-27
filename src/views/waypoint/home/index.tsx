/* eslint-disable no-case-declarations */
/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import GetStarted, { GetStartedProps } from './components/get-started'
import Cards, { CardProps } from './components/cards'
import Heading, { HeadingProps } from './components/heading'

function WaypointLanding({
  CONTENT,
}: {
  CONTENT: { heading: string; subheading: string; blocks: Block[] }
}): ReactElement {
  return (
    <div>
      <h1>{CONTENT.heading}</h1>
      <p>{CONTENT.subheading}</p>
      <LandingBlocks blocks={CONTENT.blocks} />
    </div>
  )
}

interface BlockBase {
  type: 'heading' | 'get_started' | 'cards'
}

type Block =
  | (HeadingProps & BlockBase)
  | (GetStartedProps & BlockBase)
  | (CardProps & BlockBase)

function LandingBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, idx) => {
        const { type, heading } = block
        switch (type) {
          case 'heading':
            const { __heading_slug, level } = block
            return <Heading key={idx} {...{ __heading_slug, heading, level }} />
          case 'get_started':
            const { iconSvg, text, link } = block
            return (
              <GetStarted key={idx} {...{ iconSvg, heading, text, link }} />
            )
          case 'cards':
            const { columns, cards } = block
            return <Cards key={idx} {...{ columns, cards }} />
          default:
            return (
              <pre key={idx} style={{ border: '1px solid red' }}>
                <code>{JSON.stringify({ type, block }, null, 2)}</code>
              </pre>
            )
        }
      })}
    </>
  )
}

WaypointLanding.layout = DocsLayout
export default WaypointLanding
