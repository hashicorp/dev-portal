/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Icons
import { IconDot16 } from '@hashicorp/flight-icons/svg-react/dot-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
// Components
import Text from 'components/text'
import IconTile from 'components/icon-tile'
import ProductIcon from 'components/product-icon'
import LinkRegion from 'components/link-region'
import { Snippet } from 'react-instantsearch'
import { FlightIcon } from '@hashicorp/mds-react/components'
// Content (icons by content type)
import { tabContentByType } from '../../content'
// Types
import { UnifiedHitProps } from './types'
// Styles
import s from './unified-hit.module.css'
import { SearchContentTypes } from '../../types'

/**
 * Render a card-like link item to a search hit.
 */
export function UnifiedHit({
	type,
	href,
	ariaLabel,
	titleHtml,
	descriptionHtml,
	productSlug,
	productName,
	hit,
}: UnifiedHitProps) {
	return (
		<LinkRegion
			className={s.root}
			href={href}
			ariaLabel={ariaLabel}
		>
			<IconTile className={s.icon} size="small">
				<FlightIcon name={tabContentByType[type].icon} />
			</IconTile>
			<div className={s.content}>
				<Text
					dangerouslySetInnerHTML={{ __html: titleHtml }}
					asElement="span"
					className={s.title}
					size={300}
					weight="medium"
				/>

				<div className={s.meta}>
					{productSlug ? (
						<>
							<div className={s.productBreadcrumb}>
								<ProductIcon
									className={s.productBreadcrumbIcon}
									productSlug={productSlug}
								/>
								<span className={s.productBreadcrumbText}>{productName}</span>
							</div>
							<IconDot16 className={s.metaDotSeparator} />
						</>
					) : null}
					<div className={s.breadcrumb}>{href}</div>
				</div>
			</div>
		</LinkRegion>
	)
}
