import React, { ReactElement } from 'react'
import { ProductSlug } from 'types/products'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { useErrorPageAnalytics } from '@hashicorp/react-error-view'
import ProductIcon from 'components/product-icon'
import { productSlugs, productSlugsToNames } from 'lib/products'
import {
	ErrorViewContainer,
	ErrorViewH1,
	ErrorViewParagraph,
} from '../components'

import s from './dev-dot-404.module.css'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'

/**
 * Build an array of link cards for each beta product
 */
const PRODUCT_LINK_CARDS = productSlugs
	// Even once Sentinel is in beta, we won't show it, since it has no icon
	.filter((productSlug: ProductSlug) => productSlug !== 'sentinel')
	// Map remaining products
	.map((productSlug: ProductSlug) => {
		return {
			url: `/${productSlug}/`,
			text: productSlugsToNames[productSlug],
			productSlug: productSlug,
			icon: <ProductIcon productSlug={productSlug} />,
		}
	})

/**
 * Generic 404 error view content for use in dev-dot.
 */
export function DevDot404(): ReactElement {
	useErrorPageAnalytics(404)

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
						...PRODUCT_LINK_CARDS,
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
