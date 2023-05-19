/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import ProductIcon from 'components/product-icon'
import { type SolutionType } from './types'
import {
	PRODUCT_SLUGS_BY_SOLUTION_TYPE,
	SOLUTION_TYPES_IN_DISPLAY_ORDER,
} from './constants'
import s from './chiclets.module.css'

const Chiclets = () => {
	return (
		<div className={s.root}>
			<p className={s.label} id="chiclets-nav-label">
				Explore tutorials & documentation by product
			</p>
			<nav aria-labelledby="chiclets-nav-label">
				<ul className={s.navList}>
					{SOLUTION_TYPES_IN_DISPLAY_ORDER.map((solutionType: SolutionType) => {
						const productSlugs = PRODUCT_SLUGS_BY_SOLUTION_TYPE[solutionType]
						return productSlugs.map((productSlug: ProductSlug) => {
							const href = `/${productSlug}`
							const text =
								productSlug === 'hcp' ? 'HCP' : productSlugsToNames[productSlug]
							return (
								<li
									key={productSlug}
									className={s[`solutionType--${solutionType}`]}
								>
									<a className={s.navListLink} href={href}>
										<div className={s.navListLinkContent}>
											<ProductIcon productSlug={productSlug} size={24} />
											<span className={s.chicletText}>{text}</span>
										</div>
									</a>
								</li>
							)
						})
					})}
				</ul>
			</nav>
		</div>
	)
}

export { Chiclets }
