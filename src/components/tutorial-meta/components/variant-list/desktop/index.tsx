/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRouter } from 'next/router'
import Link from 'components/link'
import classNames from 'classnames'
import { safeAnalyticsTrack } from 'lib/analytics'
import {
	TutorialVariant,
	TutorialVariantOption,
	getVariantParam,
	getVariantPath,
	handleVariantCookie,
	sortVariantOptions,
} from 'views/tutorial-view/utils/variants'
import s from './desktop-variant-list.module.css'

export function DesktopVariantList({ variant }: { variant: TutorialVariant }) {
	const VARIANT_LIST_ID = 'variant-list-label'
	const { asPath } = useRouter()

	return (
		<>
			<label id={VARIANT_LIST_ID} className={s.label}>
				{variant.name}
			</label>
			<nav>
				<ul aria-labelledby={VARIANT_LIST_ID} className={s.list}>
					{variant.options
						.sort(sortVariantOptions)
						.map((option: TutorialVariantOption) => {
							const variantParam = getVariantParam(variant.slug, option.slug)
							const isActiveOption = variant.activeOption.slug === option.slug
							return (
								<li key={option.slug}>
									<Link
										className={classNames(s.link)}
										href={getVariantPath(asPath, variantParam)}
										aria-current={isActiveOption ? 'page' : undefined}
										onClick={() => {
											handleVariantCookie(variant.slug, option.slug)
											safeAnalyticsTrack('Variant Selected', {
												variant: variant.slug,
												option: option.slug,
												path: asPath,
											})
										}}
									>
										{option.name}
									</Link>
								</li>
							)
						})}
				</ul>
			</nav>
		</>
	)
}
