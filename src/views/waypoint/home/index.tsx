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
        const { type } = block
        if (type === 'heading') {
          const { heading, __heading_slug, level } = block as HeadingProps
          return <Heading key={idx} {...{ __heading_slug, heading, level }} />
        } else if (type === 'get_started') {
          const { heading, iconSvg, text, link } = block as GetStartedProps
          return <GetStarted key={idx} {...{ iconSvg, heading, text, link }} />
        } else if (type === 'cards') {
          const { columns, cards } = block as CardProps
          return <Cards key={idx} {...{ columns, cards }} />
        }
        return (
          <pre key={idx} style={{ border: '1px solid red' }}>
            <code>{JSON.stringify({ type, block }, null, 2)}</code>
          </pre>
        )
      })}
    </>
  )
}

WaypointLanding.layout = DocsLayout
export default WaypointLanding
