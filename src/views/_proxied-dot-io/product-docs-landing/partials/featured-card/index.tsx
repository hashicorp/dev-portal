import { ReactElement } from 'react'
import Button from '@hashicorp/react-button'
import Card from 'components/card'
import FlexFloat from '../flex-float'
import { FeaturedCardProps } from './types'
import s from './style.module.css'

function FeaturedCard({
  heading,
  imgSrc,
  body,
  links,
}: FeaturedCardProps): ReactElement {
  return (
    <Card className={s.featuredCard}>
      <article className={s.featuredCardContent}>
        <div className={s.featuredCardText}>
          <h1 className={s.featuredCardHeading}>{heading}</h1>
          <p className={s.featuredCardBody}>{body}</p>
          <div className={s.featuredCardCtas}>
            <FlexFloat gap={8}>
              {links.map(({ title, url }, stableIdx) => {
                const variant = stableIdx == 0 ? 'primary' : 'secondary'
                return (
                  <Button
                    // eslint-disable-next-line react/no-array-index-key
                    key={stableIdx}
                    theme={{
                      variant,
                      // TODO: use product context, or expose via prop
                      brand: 'vault',
                    }}
                    title={title}
                    url={url}
                    size="small"
                  />
                )
              })}
            </FlexFloat>
          </div>
        </div>
        <div className={s.featuredCardImage}>
          <img src={imgSrc} alt="" />
        </div>
      </article>
    </Card>
  )
}

export default FeaturedCard
