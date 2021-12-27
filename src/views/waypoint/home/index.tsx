/* eslint-disable no-case-declarations */
/* eslint-disable react/no-array-index-key */
import { ReactElement } from 'react'
import DocsLayout from 'layouts/docs'
import GetStarted from './components/get-started'
import Cards from './components/cards'

function WaypointLanding({ CONTENT }: { CONTENT: $TSFixMe }): ReactElement {
  return (
    <div>
      <h1>{CONTENT.heading}</h1>
      <p>{CONTENT.subheading}</p>
      <LandingBlocks blocks={CONTENT.blocks} />
    </div>
  )
}

function LandingBlocks({ blocks }: { blocks: $TSFixMe[] }) {
  return (
    <>
      {blocks.map((block, idx) => {
        const { type, heading } = block
        switch (type) {
          case 'h2':
            const { __heading_slug } = block
            return (
              <h2 key={idx} id={__heading_slug}>
                {heading}
              </h2>
            )
          case 'get_started':
            const { text, link } = block
            return <GetStarted key={idx} {...{ heading, text, link }} />
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
