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

function CustomHits() {
	const { indexUiState } = useInstantSearch()
	const { hits } = useHits()

	if (!indexUiState.query) {
		return <>Type a search...</>
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
			{hits.map((hit) => {
				const { objectID, _type, products, _highlightResult } = hit as $TSFixMe
				const { page_title, description, urlPath } = _highlightResult
				return (
					<div key={objectID}>
						<CardLink href={hit.urlPath} ariaLabel={hit.page_title as string}>
							<Text
								dangerouslySetInnerHTML={{
									__html:
										`[${_type}] ` +
										page_title.value +
										` (products: ${products.join(', ')})`,
								}}
								asElement="span"
								className={s.withHighlight}
								size={200}
								weight="medium"
							/>
							<br />
							<Text
								dangerouslySetInnerHTML={{
									__html: description.value,
								}}
								asElement="span"
								className={s.withHighlight}
								size={200}
							/>
							<br />
							<Text
								dangerouslySetInnerHTML={{
									__html: urlPath.value,
								}}
								asElement="span"
								className={s.withHighlight}
								style={{ color: 'gray' }}
								size={200}
							/>
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
