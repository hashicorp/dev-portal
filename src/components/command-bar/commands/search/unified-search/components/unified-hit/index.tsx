// Components
import CardLink from 'components/card-link'
import Text from 'components/text'
// Helpers
import { buildUrlPath, renderHighlightArrayHtml } from './helpers'
// Types
import type { Hit } from 'instantsearch.js'
// Styles
import s from './unified-hit.module.css'
import { buildUrlPathWithHighlights } from './helpers/build-url-path-with-highlights'
import classNames from 'classnames'

/**
 * TODO: this is a placeholder component for a "hit" card component.
 * It can likely be ignored for now.
 *
 * We'll replace this with something properly usable in a future pass
 * to the "All" tab work for unified search.
 */
export function UnifiedHit({ hit }: { hit: Hit }) {
	const { objectID, _highlightResult } = hit as $TSFixMe
	const { page_title, type, description, products, headings, codeListItems } =
		_highlightResult

	const urlPath = buildUrlPath(hit)
	const urlPathWithHighlight = buildUrlPathWithHighlights(hit)
	const hasUrlPathHighlight = urlPathWithHighlight.includes('<mark>')

	const headingsHighlight = renderHighlightArrayHtml(headings, true).join(', ')
	const hasHeadingsHighlight = !!headingsHighlight
	const codeListItemsHighlight = renderHighlightArrayHtml(
		codeListItems,
		true
	).join(', ')
	const hasCodeListHighlight = !!codeListItemsHighlight

	const hasDefaultProduct = !!products && products.length > 0
	const productsHighlight = renderHighlightArrayHtml(products)

	const otherProducts = products?.length > 1 ? products.slice(1) : []
	const otherProductsHighlight = otherProducts
		.filter((e) => e.matchLevel !== 'none')
		.map((entry) => {
			return entry?.value
		})
		.join(', ')
	const hasOtherProductsHighlight =
		otherProducts.filter((e) => e.matchLevel !== 'none').length > 0

	return (
		<div
			key={objectID}
			className={classNames(s.cardLinkColorOverride)}
			style={{
				border: '1px solid magenta',
				color: 'var(--token-color-foreground-strong)',
			}}
		>
			<CardLink href={urlPath} ariaLabel={hit.page_title as string}>
				<div className={s.cardRoot}>
					<div className={s.cardIcon}>
						<TextWithHighlight html={type?.value} />
					</div>
					<div className={s.cardContents}>
						<div className={s.resultTitle}>
							<TextWithHighlight html={page_title?.value} />
						</div>
						<div className={s.resultDescription}>
							<TextWithHighlight html={description?.value} />
						</div>
						<div className={s.resultMeta}>
							<div
								data-has-highlight={
									productsHighlight[0] &&
									productsHighlight[0].includes('<mark>')
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
								data-has-highlight={headingsHighlight.includes('<mark>')}
								data-hidden={
									!headingsHighlight.includes('<mark>') || hasUrlPathHighlight
								}
							>
								<TextWithHighlight html="Matched headings: " />
								<TextWithHighlight html={headingsHighlight} />
							</div>
							<div
								data-has-highlight={codeListItemsHighlight.includes('<mark>')}
								data-hidden={
									!codeListItemsHighlight.includes('<mark>') ||
									hasUrlPathHighlight ||
									hasHeadingsHighlight
								}
							>
								<TextWithHighlight html="Matched code list items: " />
								<TextWithHighlight html={codeListItemsHighlight} />
							</div>
						</div>
					</div>
				</div>
			</CardLink>
		</div>
	)
}

function TextWithHighlight({ html }: { html: string }) {
	return (
		<Text
			dangerouslySetInnerHTML={{
				__html: html,
			}}
			asElement="span"
			className={s.withHighlight}
			size={200}
			weight="medium"
		/>
	)
}
