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

	// TODO: build highlighted urlPath
	const urlPath = buildUrlPath(hit)
	const urlPathWithHighlight = buildUrlPathWithHighlights(hit)
	const headingsHighlight = renderHighlightArrayHtml(headings, true)
	const codeListItemsHighlight = renderHighlightArrayHtml(codeListItems, true)

	return (
		<div
			key={objectID}
			className={s.cardLinkColorOverride}
			style={{
				border: '1px solid magenta',
				color: 'var(--token-color-foreground-strong)',
			}}
		>
			<CardLink href={urlPath} ariaLabel={hit.page_title as string}>
				<Text
					dangerouslySetInnerHTML={{
						__html:
							`[${type?.value}] ` +
							page_title?.value +
							` (products: ${renderHighlightArrayHtml(products)})`,
					}}
					asElement="span"
					className={s.withHighlight}
					size={200}
					weight="medium"
				/>
				<br />
				<Text
					dangerouslySetInnerHTML={{
						__html: description?.value,
					}}
					style={{ lineHeight: '1.6em', marginTop: '4px' }}
					className={s.withHighlight}
					size={200}
				/>
				<Text
					dangerouslySetInnerHTML={{
						__html: urlPathWithHighlight,
					}}
					className={s.withHighlight}
					style={{
						color: 'var(--token-color-foreground-faint)',
						marginTop: '8px',
					}}
					size={200}
				/>
				{headingsHighlight ? (
					<>
						<Text style={{ marginTop: '12px' }} size={200} weight="medium">
							Headings:
						</Text>
						<Text
							dangerouslySetInnerHTML={{
								__html: headingsHighlight,
							}}
							asElement="span"
							className={s.withHighlight}
							style={{
								color: 'var(--token-color-foreground-faint)',
								display: 'block',
								paddingLeft: '8px',
							}}
							size={200}
						/>
					</>
				) : null}
				{codeListItemsHighlight ? (
					<>
						<Text style={{ marginTop: '12px' }} size={200} weight="medium">
							Code List Items:
						</Text>
						<Text
							dangerouslySetInnerHTML={{
								__html: codeListItemsHighlight,
							}}
							asElement="span"
							className={s.withHighlight}
							style={{
								color: 'var(--token-color-foreground-faint)',
								display: 'block',
								paddingLeft: '8px',
							}}
							size={200}
						/>
					</>
				) : null}

				{/* <pre>
						<code>{JSON.stringify({ hit }, null, 2)}</code>
					</pre> */}
			</CardLink>
		</div>
	)
}
