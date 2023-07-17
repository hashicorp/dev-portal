/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Icons
import { IconDot16 } from '@hashicorp/flight-icons/svg-react/dot-16'
// Components
import Text from 'components/text'
import IconTile from 'components/icon-tile'
import ProductIcon from 'components/product-icon'
import LinkRegion from 'components/link-region'
// Content (icons by content type)
import { tabContentByType } from '../../content'
// Types
import { UnifiedHitProps } from './types'
// Styles
import s from './unified-hit.module.css'

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
}: UnifiedHitProps) {
	return (
		<LinkRegion className={s.root} href={href} ariaLabel={ariaLabel}>
			<IconTile className={s.icon} size="small">
				{tabContentByType[type].icon}
			</IconTile>
			<div className={s.content}>
				<Text
					dangerouslySetInnerHTML={{ __html: titleHtml }}
					asElement="span"
					className={s.title}
					size={300}
					weight="medium"
				/>
				<Text
					dangerouslySetInnerHTML={{ __html: descriptionHtml }}
					asElement="span"
					className={s.description}
					size={200}
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
