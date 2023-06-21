// Components
import Text from 'components/text'
// Helpers
import { buildUrlPath } from './helpers'
import { normalizeSlugForDevDot } from 'lib/tutorials/normalize-product-like-slug'

// Types
import type { Hit, HitAttributeHighlightResult } from 'instantsearch.js'
// Styles
import s from './unified-hit.module.css'
import LinkRegion from './components/link-region'
import IconTile from 'components/icon-tile'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDot16 } from '@hashicorp/flight-icons/svg-react/dot-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import ProductIcon from 'components/product-icon'
import { isProductSlug, productSlugsToNames } from 'lib/products'
import { ProductSlug } from 'types/products'

/**
 * TODO: update description
 *
 * We'll replace this with something properly usable in a future pass
 * to the "All" tab work for unified search.
 *
 * TODO: move the parsing logic here to a helper (Hit --> UnifiedHitProps)
 * so that `UnifiedHit` becomes a simpler presentation component.
 */
export function UnifiedHit({ hit }: { hit: Hit }) {
	const { page_title, description } = hit._highlightResult

	/**
	 * Determine the "default product slug" for this entry.
	 *
	 * Docs and integrations are always expected to have a single product.
	 * Tutorials may have no products (for WAF and onboarding), otherwise
	 * their default collection context signals their default product.
	 *
	 * TODO: move this to a helper, parseDefaultProductSlug (Hit --> ProductSlug)
	 */
	let defaultProductSlug: ProductSlug
	if (hit.type === 'tutorial') {
		const normalizedSlug = normalizeSlugForDevDot(hit.defaultContext.section)
		defaultProductSlug = isProductSlug(normalizedSlug) ? normalizedSlug : null
	} else {
		const hasDefaultProduct =
			Array.isArray(hit.products) && hit.products.length > 0
		defaultProductSlug = hasDefaultProduct ? hit.products[0] : null
	}
	if (!isProductSlug(defaultProductSlug)) {
		defaultProductSlug = null
	}

	/**
	 * TODO: Move this to a helper, parseUnifiedHitProps (Hit --> UnifiedHitProps)
	 */
	const ariaLabel = hit.page_title + ' ' + hit.description
	const href = buildUrlPath(hit)
	const type = hit.type
	const titleHtml = (page_title as HitAttributeHighlightResult).value
	const descriptionHtml = (description as HitAttributeHighlightResult).value
	const productSlug = defaultProductSlug
	const productName =
		defaultProductSlug === 'hcp'
			? 'HCP'
			: productSlugsToNames[defaultProductSlug]

	return (
		<UnifiedHitPresentation
			ariaLabel={ariaLabel}
			href={href}
			type={type}
			titleHtml={titleHtml}
			descriptionHtml={descriptionHtml}
			productSlug={productSlug}
			productName={productName}
		/>
	)
}

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

function UnifiedHitPresentation({
	type,
	href,
	ariaLabel,
	titleHtml,
	descriptionHtml,
	productSlug,
	productName,
}: {
	type: AlgoliaContentType
	href: string
	ariaLabel: string
	titleHtml: string
	descriptionHtml: string
	productSlug: ProductSlug
	productName: string
}) {
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
