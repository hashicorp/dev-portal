import { EditionOption, ProductOption } from 'lib/learn-client/types'

interface BadgesProps {
  tutorialMeta: {
    readTime: number
    products: ProductOption[]
    edition: EditionOption
    hasVideo: boolean
    isInteractive: boolean
  }
}
export function Badges({ tutorialMeta }: BadgesProps): React.ReactElement {
  const { readTime, products, edition, hasVideo, isInteractive } = tutorialMeta
  return (
    <>
      <h2>Badges Stub</h2>
      <p>Read time: {readTime} min</p>
      <p>Products used: {products.join(', ')}</p>
      <p>Edition: {edition}</p>
      <p>Video: {`${hasVideo}`}</p>
      <p>Interactive Lab: {`${isInteractive}`}</p>
    </>
  )
}
