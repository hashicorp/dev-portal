import { ReactElement } from 'react'
import CardLink from 'components/card-link'
import FeaturedCard from './components/featured-card'
import UseCaseCard from './components/use-case-card'
import s from './style.module.css'

interface ProductDocsLandingProps {
  content: $TSFixMe
  themeSlug: $TSFixMe
}

function ProductDocsLanding({
  content,
  themeSlug,
}: ProductDocsLandingProps): ReactElement {
  // Note: later we could use this view with products other than Vault,
  // and put this content somewhere more author-friendly (eg DatoCMS).
  const {
    pageTitle,
    pageSubtitle,
    featuredCard,
    useCaseCards,
    developerCards,
  } = content

  return (
    <div className={s.pageContent}>
      <h1 className="g-type-display-2">{pageTitle}</h1>
      <p>{pageSubtitle}</p>
      <FeaturedCard
        heading={featuredCard.heading}
        image={featuredCard.image}
        body={featuredCard.body}
        links={featuredCard.links}
        productThemeSlug={themeSlug}
      />
      <h2 className="g-type-display-3">Use Cases</h2>
      <div className={s.useCaseCards}>
        {useCaseCards.map(({ heading, body, links }, stableIdx) => {
          return (
            <UseCaseCard
              // eslint-disable-next-line react/no-array-index-key
              key={stableIdx}
              heading={heading}
              body={body}
              links={links}
              productThemeSlug={themeSlug}
            />
          )
        })}
      </div>
      <h2 className="g-type-display-3">Developers</h2>
      <div className={s.developerCards}>
        {developerCards.map(({ title, url }, stableIdx) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <CardLink key={stableIdx} href={url} className={s.developerCard}>
              {title}
            </CardLink>
          )
        })}
      </div>
    </div>
  )
}

export default ProductDocsLanding
