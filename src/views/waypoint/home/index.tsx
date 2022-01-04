/* eslint-disable react/no-array-index-key */
import React, { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import GetStarted, { GetStartedProps } from './components/get-started'
import Cards, { CardProps } from './components/cards'
import Heading, { HeadingProps } from './components/heading'
import s from './style.module.css'

interface WaypointLandingProps {
  content: {
    heading: string
    subheading: string
    blocks: Block[]
  }
}

function WaypointLanding({ content }: WaypointLandingProps): ReactElement {
  return (
    <div>
      <h1 className={s.pageHeading}>{content.heading}</h1>
      <p className={s.pageSubheading}>{content.subheading}</p>
      <LandingBlocks blocks={content.blocks} />
    </div>
  )
}

type Block =
  | ({ type: 'heading' } & HeadingProps)
  | ({ type: 'get_started' } & GetStartedProps)
  | ({ type: 'cards' } & CardProps)

function LandingBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, idx) => {
        const { type } = block
        if (type === 'heading') {
          const { heading, slug, level } = block
          return <Heading key={idx} {...{ slug, heading, level }} />
        } else if (type === 'get_started') {
          const { heading, iconSvg, text, link } = block
          return <GetStarted key={idx} {...{ iconSvg, heading, text, link }} />
        } else if (type === 'cards') {
          const { columns, cards } = block
          return <Cards key={idx} {...{ columns, cards }} />
        }
        // If we don't have a recognized card type,
        // return a dev-oriented debug view of the block data
        // TODO: remove this for production, this is here
        // TODO: temporarily as we work through demo-oriented implementation
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
