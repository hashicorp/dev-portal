import { EditionOption, ProductOption } from 'lib/learn-client/types'

interface BadgesProps {
  tutorialMeta: {
    readTime: number
    products: ProductOption[]
    isBeta: boolean
    edition: EditionOption
    hasVideo: boolean
    isInteractive: boolean
  }
}

export function Badges({ tutorialMeta }: BadgesProps): React.ReactElement {
  const {
    readTime,
    products,
    edition,
    isBeta,
    hasVideo,
    isInteractive,
  } = tutorialMeta
  return (
    <>
      <h2>Badges Stub</h2>
      <ul>
        <li>Read time: {readTime} min</li>
        <li>Products used: {products.join(', ')}</li>
        <li>Edition: {edition}</li>
        <li>Beta: {`${isBeta}`}</li>
        <li>Video: {`${hasVideo}`}</li>
        <li>Interactive Lab: {`${isInteractive}`}</li>
      </ul>
    </>
  )
}
