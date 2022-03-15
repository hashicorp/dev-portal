import { ReactElement } from 'react'
import Card, { CardLink } from 'components/card'
import Button from '@hashicorp/react-button'
import s from './style.module.css'
import CONTENT from './vault-content'

// TODO: consider product slug setting. variable per-card?

function ProductDocsLanding(): ReactElement {
  return (
    <div className={s.pageContents}>
      <h1 className="g-type-display-2">{CONTENT.pageTitle}</h1>
      <p>{CONTENT.pageSubtitle}</p>
      <FeaturedCard
        heading={CONTENT.featuredCard.heading}
        imgSrc={CONTENT.featuredCard.imgSrc}
        body={CONTENT.featuredCard.body}
        links={CONTENT.featuredCard.links}
      />
      <h2 className="g-type-display-3">Use Cases</h2>
      <div className={s.useCaseCards}>
        {CONTENT.useCaseCards.map(({ heading, body, links }, stableIdx) => {
          return (
            <UseCaseCard
              // eslint-disable-next-line react/no-array-index-key
              key={stableIdx}
              heading={heading}
              body={body}
              links={links}
            />
          )
        })}
      </div>
      <h2 className="g-type-display-3">Developers</h2>
      <div className={s.developerCards}>
        {CONTENT.developerCards.map(({ title, url }, stableIdx) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <CardLink key={stableIdx} href={url}>
              {title}
            </CardLink>
          )
        })}
      </div>
    </div>
  )
}

/**
 * TODO: split this out into a separate component folder
 */
function FeaturedCard({ heading, imgSrc, body, links }) {
  return (
    <Card className={s.featuredCard}>
      <article className={s.featuredCardContent}>
        <div className={s.featuredCardText}>
          <h1 className={s.featuredCardHeading}>{heading}</h1>
          <p className={s.featuredCardBody}>{body}</p>
          <div className={s.featuredCardCtas}>
            <div className={s.flexGridParent}>
              {links.map(({ title, url }, stableIdx) => {
                const variant = stableIdx == 0 ? 'primary' : 'secondary'
                return (
                  <Button
                    // eslint-disable-next-line react/no-array-index-key
                    key={stableIdx}
                    theme={{
                      variant,
                      brand: 'vault',
                    }}
                    title={title}
                    url={url}
                    size="small"
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className={s.featuredCardImage}>
          <img src={imgSrc} alt="" />
        </div>
      </article>
    </Card>
  )
}

/**
 * TODO: split this out into a separate component folder
 */
function UseCaseCard({ heading, body, links }) {
  return (
    <Card>
      <article className={s.useCaseCardContent}>
        <h1 className={s.useCaseCardHeading}>{heading}</h1>
        <p className={s.useCaseCardBody}>{body}</p>
        <div className={s.useCaseCardCtas}>
          <div className={s.flexGridParent}>
            {links.map(({ title, url }, stableIdx) => {
              return (
                <Button
                  // eslint-disable-next-line react/no-array-index-key
                  key={stableIdx}
                  theme={{
                    variant: 'tertiary',
                    brand: 'vault',
                  }}
                  title={title}
                  url={url}
                  size="small"
                />
              )
            })}
          </div>
        </div>
      </article>
    </Card>
  )
}

export default ProductDocsLanding
