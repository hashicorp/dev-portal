/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import CardLink from 'components/card-link'
import FeaturedCard from './components/featured-card'
import UseCaseCard from './components/use-case-card'
import { ProductDocsLandingProps } from './types'
import s from './style.module.css'

function ProductDocsLanding({
	content,
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
						/>
					)
				})}
			</div>
			<h2 className="g-type-display-3">Developers</h2>
			<div className={s.developerCards}>
				{developerCards.map(({ title, url }, stableIdx) => {
					return (
						<CardLink
							ariaLabel={title}
							// eslint-disable-next-line react/no-array-index-key
							key={stableIdx}
							href={url}
							className={s.developerCard}
						>
							{title}
						</CardLink>
					)
				})}
			</div>
		</div>
	)
}

export type { ProductDocsLandingProps }
export default ProductDocsLanding
