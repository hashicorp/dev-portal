import Heading from 'components/heading'
// import { Badges, getIsBeta } from './components'
import InteractiveLabButton from './components/interactive-lab-button'

interface TutorialMetaProps {
  heading: { slug: string; text: string }
  readTime: number
  isInteractive: boolean
  hasVideo: boolean
}

export default function TutorialMeta({
  isInteractive,
  heading,
}: TutorialMetaProps) {
  return (
    <header>
      <Heading
        level={1}
        size={500}
        weight="bold"
        slug={heading.slug}
        id={heading.slug}
      >
        {heading.text}
      </Heading>
      {/* <Badges
        tutorialMeta={{
          readTime,
          products: productsUsed.map((p) => p.product.slug),
          isBeta: getIsBeta(productsUsed),
          edition,
          hasVideo: Boolean(video),
          isInteractive: Boolean(handsOnLab),
        }}
      /> */}
      <InteractiveLabButton showButton={isInteractive} />
    </header>
  )
}
