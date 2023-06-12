// Components
import CardLink from 'components/card-link'
import Text from 'components/text'
// Helpers
import { buildUrlPath, renderHighlightArrayHtml } from './helpers'
// Types
import type { Hit } from 'instantsearch.js'
// Styles
import s from './unified-hit.module.css'

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

	/**
	 * TODO: construct urlPath from hit data,
	 * use highlighted hit data I think?
	 * (Reference how we do this currently for each content type, we have
	 * all the same data so should be able to do the same thing here)
	 *
	 * Alternately, add `urlPath` to all search objects.
	 * On the fence about which to do, want to time-box constructing
	 * the `urlPath` client side to see how much effort it is,
	 * since it feels like a better solution maybe?
	 *
	 * Although then won't match say `<product>/<content_type>` because
	 * `product` and `content_type` are in separate properties 🤔
	 * But I guess `<product> <content_type>` (space not slash)
	 * would work fine as a query?
	 *
	 * Only disadvantage of `urlPath` in search object is it needs
	 * to be updated in tandem with front-end. To address this, could
	 * add a different `urlPath_<changeIdentifier>` before rolling out a
	 * new feature, once the old `hit.urlPath` is no longer used then
	 * migrate to it by making both values the same, and switching which
	 * is used, and then once `urlPath_<changeIdentifier>` is no longer
	 * used remove it completely from indexing. Complex though if URL
	 * changes happen, which they're kind of expected to!
	 */
	const urlPath = buildUrlPath(hit)

	const headingsHighlight = renderHighlightArrayHtml(headings, true)
	const codeListItemsHighlight = renderHighlightArrayHtml(codeListItems, true)

	return (
		<div key={objectID}>
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
						__html: urlPath,
					}}
					className={s.withHighlight}
					style={{ color: 'gray', marginTop: '8px' }}
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
								color: 'gray',
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
								color: 'gray',
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
