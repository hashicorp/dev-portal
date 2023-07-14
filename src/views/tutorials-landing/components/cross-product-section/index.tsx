/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { Collection } from 'lib/learn-client/types'
import CollectionContentCardLink from 'components/tutorials-landing-view/collection-content-card-link'
import s from './cross-product-section.module.css'

interface CrossProductSectionProps {
	className?: string
	collections: Collection[]
	title: string
}

const CrossProductSection = ({
	className,
	collections,
	title,
}: CrossProductSectionProps) => {
	return (
		<div className={classNames(s.root, className)}>
			<h2 className={s.title}>{title}</h2>
			<ul className={s.list}>
				{collections.map((collection: Collection) => {
					return (
						<li className={s.listItem} key={collection.slug}>
							<CollectionContentCardLink
								collection={collection}
								hideBadges
								hideImages
							/>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export { CrossProductSection }
