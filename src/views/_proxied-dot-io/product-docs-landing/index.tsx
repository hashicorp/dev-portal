import { ReactElement } from 'react'
import CardLink from 'components/card-link'
import FeaturedCard from './partials/featured-card'
import UseCaseCard from './partials/use-case-card'
import s from './style.module.css'
import CONTENT from './vault-content'

function ProductDocsLanding(): ReactElement {
  return (
    <div className={s.pageContent}>
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

export default ProductDocsLanding
