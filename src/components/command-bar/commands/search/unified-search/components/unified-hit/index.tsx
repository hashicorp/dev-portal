// Icons
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDot16 } from '@hashicorp/flight-icons/svg-react/dot-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
// Components
import Text from 'components/text'
import IconTile from 'components/icon-tile'
import ProductIcon from 'components/product-icon'
import LinkRegion from './components/link-region'
// Types
import { UnifiedHitProps } from './types'
// Styles
import s from './unified-hit.module.css'

type AlgoliaContentType = 'docs' | 'tutorial' | 'integration'

/**
 * TODO: move this somewhere else, it's also used for tabs.
 * Could add "global" here as well.
 * Basically a partial version of `tabContentByType`.
 */
const iconComponentMap: Record<AlgoliaContentType, $TSFixMe> = {
	docs: <IconDocs16 />,
	tutorial: <IconLearn16 />,
	integration: <IconPipeline16 />,
}

/**
 * Render a link to a search hit.
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
				{iconComponentMap[type]}
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
