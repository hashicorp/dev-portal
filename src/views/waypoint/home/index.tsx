/* eslint-disable no-case-declarations */
/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import GetStarted, { GetStartedProps } from './components/get-started'
import Cards, { CardProps, CardInterface } from './components/cards'
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
  // TODO: properties below are already defined,
  // TODO: eg in HeadingProps, GetStartedProps, & CardProps,
  // TODO: but still getting TypeScript compile errors in switch
  // TODO: blocks below.
  // TODO: Need to figure out how to do this type union (?) thing properly
  heading?: string
  __heading_slug?: string
  level?: number
  iconSvg?: string
  text?: string
  link?: {
    url: string
    text: string
  }
  columns?: number
  cards?: CardInterface[]
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
