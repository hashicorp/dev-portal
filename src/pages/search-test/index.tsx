// Third-party
import algoliasearch from 'algoliasearch/lite'
import {
	InstantSearch,
	SearchBox,
	useHits,
	useInstantSearch,
} from 'react-instantsearch-hooks-web'
// Components
import CardLink from 'components/card-link'
import Text from 'components/text'
// Local
import s from './search-test.module.css'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const searchClient = algoliasearch(appId, apiKey)

// const customSearchClient = {
// 	search(requests) {
// 		return fetch('/api/search', {
// 			method: 'post',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ requests }),
// 		}).then((res) => res.json())
// 	},
// }

function renderHighlightArray(facet, matchesOnly = false) {
	return (facet || [])
		.filter((entry) => {
			if (matchesOnly) {
				return entry.matchLevel !== 'none'
			} else {
				return true
			}
		})
		.map((entry) => {
			return entry?.value
		})
		.join(', ')
}

function CustomHits() {
	const { indexUiState } = useInstantSearch()
	const { hits } = useHits()

	if (!indexUiState.query) {
		return <>Type a search...</>
	}

	if (hits.length === 0) {
		return <>No results.</>
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
			{hits.map((hit) => {
				const { objectID, _highlightResult } = hit as $TSFixMe
				const {
					page_title,
					_type,
					description,
					urlPath,
					products,
					headings,
					codeListItems,
				} = _highlightResult

				const headingsHighlight = renderHighlightArray(headings, true)
				const codeListItemsHighlight = renderHighlightArray(codeListItems, true)

				return (
					<div key={objectID}>
						<CardLink href={hit.urlPath} ariaLabel={hit.page_title as string}>
							<Text
								dangerouslySetInnerHTML={{
									__html:
										`[${_type?.value}] ` +
										page_title?.value +
										` (products: ${renderHighlightArray(products)})`,
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
									__html: urlPath?.value,
								}}
								className={s.withHighlight}
								style={{ color: 'gray', marginTop: '8px' }}
								size={200}
							/>
							{headingsHighlight ? (
								<>
									<Text
										style={{ marginTop: '12px' }}
										size={200}
										weight="medium"
									>
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
									<Text
										style={{ marginTop: '12px' }}
										size={200}
										weight="medium"
									>
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
			})}
		</div>
	)
}

function SearchTest() {
	return (
		<div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto' }}>
			<p>Omni Search Test</p>
			<InstantSearch indexName="spike_DEVDOT_omni" searchClient={searchClient}>
				<SearchBox />
				<CustomHits />
			</InstantSearch>
		</div>
	)
}

export default SearchTest
