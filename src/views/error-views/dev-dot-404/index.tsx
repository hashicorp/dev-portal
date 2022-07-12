import React, { ReactElement, useMemo } from 'react'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import ProductIcon from 'components/product-icon'
import {
	ErrorViewContainer,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'
import s from './dev-dot-404.module.css'

/**
 * Build an array of link cards representing each beta product.
 */
const generateLinkCards = () => {
	const linkCards = []

	__config.dev_dot.beta_product_slugs.forEach((productSlug: ProductSlug) => {
		if (productSlug !== 'sentinel') {
			linkCards.push({
				url: `/${productSlug}/`,
				text: productSlugsToNames[productSlug],
				productSlug: productSlug,
				icon: <ProductIcon productSlug={productSlug} />,
			})
		}
	})

	return linkCards
}

/**
 * Generic 404 error view content for use in dev-dot.
 */
export function DevDot404(): ReactElement {
	useErrorPageAnalytics(404)

	const productLinkCards = useMemo(generateLinkCards, [])

	return (
		<ErrorViewContainer>
			<ErrorViewH1>
				We couldn&apos;t find the page you&apos;re looking&nbsp;for.
			</ErrorViewH1>
			<ErrorViewParagraph>
				Please check the url you entered for typos, go back to the page you came
				from, or go to one of the pages below.
			</ErrorViewParagraph>
			<div className={s.cards}>
				<IconCardLinkGridList
					cards={[
						...productLinkCards,
						{
							url: '/',
							text: 'HashiCorp Developer',
							productSlug: 'hcp',
							icon: <IconHome16 />,
						},
					]}
				/>
			</div>
		</ErrorViewContainer>
	)
}
