// Components
import CardLink from 'components/card-link'
import Text from 'components/text'
// Helpers
import { buildUrlPath, renderHighlightArrayHtml } from './helpers'
// Types
import type { Hit, HitAttributeHighlightResult } from 'instantsearch.js'
// Styles
import s from './unified-hit.module.css'
import { buildUrlPathWithHighlights } from './helpers/build-url-path-with-highlights'
import LinkCoverParent from './components/link-cover-parent'
import IconTile from 'components/icon-tile'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDot16 } from '@hashicorp/flight-icons/svg-react/dot-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import ProductIcon from 'components/product-icon'
import { isProductSlug, productSlugsToNames } from 'lib/products'
import { ProductSlug } from 'types/products'

/**
 * TODO: this is a placeholder component for a "hit" card component.
 * It can likely be ignored for now.
 *
 * We'll replace this with something properly usable in a future pass
 * to the "All" tab work for unified search.
 */
export function UnifiedHit({ hit }: { hit: Hit }) {
	const { page_title, description } = hit._highlightResult

	/**
	 * Determine the "default product slug" for this entry.
	 *
	 * Docs and integrations are always expected to have a single product.
	 * Tutorials may have no products (for WAF and onboarding), otherwise
	 * their default collection context signals their default product.
	 */
	let defaultProductSlug: ProductSlug
	if (hit.type === 'tutorial') {
		defaultProductSlug = hit.defaultContext.section
	} else {
		const hasDefaultProduct =
			Array.isArray(hit.products) && hit.products.length > 0
		defaultProductSlug = hasDefaultProduct ? hit.products[0] : null
	}
	if (!isProductSlug(defaultProductSlug)) {
		defaultProductSlug = null
	}

	const urlPath = buildUrlPath(hit)
	const urlPathWithHighlight = buildUrlPathWithHighlights(hit)

	return (
		<>
			<UnifiedHitPresentation
				ariaLabel={hit.page_title + ' ' + hit.description}
				href={urlPath}
				type={hit.type}
				titleHtml={(page_title as HitAttributeHighlightResult).value}
				descriptionHtml={(description as HitAttributeHighlightResult).value}
				productSlug={defaultProductSlug}
				breadcrumbHtml={urlPathWithHighlight}
				productName={
					defaultProductSlug === 'hcp'
						? 'HCP'
						: productSlugsToNames[defaultProductSlug]
				}
			/>
		</>
	)
}

type AlgoliaContentType = 'docs' | 'tutorial' | 'integration'

function UnifiedHitPresentation({
	type,
	href,
	ariaLabel,
	titleHtml,
	descriptionHtml,
	productSlug,
	productName,
	breadcrumbHtml,
}: {
	type: AlgoliaContentType
	href: string
	ariaLabel: string
	titleHtml: string
	descriptionHtml: string
	productSlug: ProductSlug
	productName: string
	breadcrumbHtml: string
}) {
	const iconComponentMap: Record<AlgoliaContentType, $TSFixMe> = {
		docs: <IconDocs16 />,
		tutorial: <IconLearn16 />,
		integration: <IconPipeline16 />,
	}

	return (
		<LinkCoverParent className={s.root} href={href} ariaLabel={ariaLabel}>
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
					<div
						className={s.breadcrumb}
						dangerouslySetInnerHTML={{ __html: breadcrumbHtml }}
					/>
				</div>
			</div>
		</LinkCoverParent>
	)
}

/**
 *
 *
 * WIP on META AREA
 * (going to leave out of this PR for now, I think?)
 *
 *
 *
 */

function DetailedMetaContents({ hit }: { hit: Hit }) {
	const { _highlightResult } = hit
	const { products, headings, codeListItems } = _highlightResult

	const urlPathWithHighlight = buildUrlPathWithHighlights(hit)
	const hasUrlPathHighlight = urlPathWithHighlight.includes('<mark>')

	const headingsHighlight = renderHighlightArrayHtml(headings, true).join(', ')
	const hasHeadingsHighlight = headingsHighlight.includes('<mark>')
	const codeListItemsHighlight = renderHighlightArrayHtml(
		codeListItems,
		true
	).join(', ')
	const hasCodeListHighlight = codeListItemsHighlight.includes('<mark>')

	const hasDefaultProduct = Array.isArray(products) && products.length > 0
	const productsHighlight = renderHighlightArrayHtml(products)

	// TODO: consider use of more detailed <Hit> type to avoid need for casting
	const otherProducts = (
		Array.isArray(products) && products.length > 1 ? products.slice(1) : []
	) as HitAttributeHighlightResult[]
	const otherProductsHighlight = otherProducts
		.filter((e) => e.matchLevel !== 'none')
		.map((entry) => {
			return entry?.value
		})
		.join(', ')
	const hasOtherProductsHighlight =
		otherProducts.filter((e) => e.matchLevel !== 'none').length > 0

	return (
		<>
			<div
				data-has-highlight={
					productsHighlight[0] && productsHighlight[0].includes('<mark>')
				}
				data-hidden={!hasDefaultProduct}
			>
				<TextWithHighlight html="Product: " />
				<TextWithHighlight html={productsHighlight[0]} />
			</div>
			<div
				data-has-highlight={hasUrlPathHighlight}
				// data-hidden={
				// 	!hasUrlPathHighlight &&
				// 	(hasOtherProductsHighlight ||
				// 		hasHeadingsHighlight ||
				// 		hasCodeListHighlight)
				// }
			>
				<TextWithHighlight html="URL path: " />
				<TextWithHighlight html={urlPathWithHighlight} />
			</div>
			<div
				data-has-highlight={hasOtherProductsHighlight}
				data-hidden={otherProducts.length === 0 || hasUrlPathHighlight}
			>
				<TextWithHighlight html="Matched other product(s): " />
				<TextWithHighlight html={otherProductsHighlight} />
			</div>
			<div
				data-has-highlight={hasHeadingsHighlight}
				data-hidden={!hasHeadingsHighlight || hasUrlPathHighlight}
			>
				<TextWithHighlight html="Matched headings: " />
				<TextWithHighlight html={headingsHighlight} />
			</div>
			<div
				data-has-highlight={hasCodeListHighlight}
				data-hidden={
					!hasCodeListHighlight || hasUrlPathHighlight || hasHeadingsHighlight
				}
			>
				<TextWithHighlight html="Matched code list items: " />
				<TextWithHighlight html={codeListItemsHighlight} />
			</div>
		</>
	)
}

function TextWithHighlight({ html }: { html: string }) {
	return (
		<Text
			dangerouslySetInnerHTML={{ __html: html }}
			asElement="span"
			className={s.withHighlight}
			size={200}
			weight="medium"
		/>
	)
}
