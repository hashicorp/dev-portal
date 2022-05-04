import { ReactElement } from 'react'
import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { useCurrentProduct } from 'contexts'
import getTruncatedText from 'lib/get-truncated-text'
import { FeaturedTutorial } from 'views/product-downloads-view/types'
import CardLink from 'components/card-link'
import Heading from 'components/heading'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import s from './featured-tutorials-section.module.css'

interface FeaturedTutorialsSectionProps {
  featuredTutorials: FeaturedTutorial[]
}

const FeaturedTutorialsSection = ({
  featuredTutorials,
}: FeaturedTutorialsSectionProps): ReactElement => {
  const currentProduct = useCurrentProduct()

  return (
    <>
      <Heading
        className={s.sectionHeading}
        level={2}
        size={300}
        id="featured-tutorials"
        weight="bold"
      >
        Featured Tutorials
      </Heading>
      <div className={s.cardGrid}>
        {featuredTutorials.map(({ title, description, href }) => {
          return (
            /**
             * TODO: these will more than likely be replaced by a future
             * `LearnTutorialCard` component.
             *
             * ref: https://app.asana.com/0/1201010428539925/1201654639085737/f
             */
            <CardLink className={s.card} key={href} href={href}>
              <div>
                <Text className={s.cardTitle} size={300} weight="semibold">
                  {title}
                </Text>
                <Text className={s.cardBody} size={200} weight="regular">
                  {getTruncatedText(description, 80)}
                </Text>
              </div>
              <div className={s.cardIcons}>
                <IconPlay16 />
                <ProductIcon productSlug={currentProduct.slug} />
              </div>
            </CardLink>
          )
        })}
      </div>
    </>
  )
}

export default FeaturedTutorialsSection
