// import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, Index, SearchBox } from 'react-instantsearch-hooks-web'
import { useHits } from 'react-instantsearch-hooks-web'

// const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
// const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
// const searchClient = algoliasearch(appId, apiKey, {
// 	queryParameters: { getRankingInfo: 'true' },
// })

const customSearchClient = {
	search(requests) {
		return fetch('/api/search', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests }),
		}).then((res) => res.json())
	},
}

function CustomHits() {
	const { hits } = useHits()
	return (
		<>
			<pre>
				<code>
					{JSON.stringify(
						{
							hits: hits.map((hit) => {
								return {
									'__rankingInfo.userScore': hit._rankingInfo.userScore,
									__position: hit.__position,
									objectID: hit.objectID,
									page_title: hit.page_title,
									// ...hit,
								}
							}),
						},
						null,
						2
					)}
				</code>
			</pre>
		</>
	)
}

function SearchTest() {
	return (
		<>
			<p>Hello SearchTest page</p>
			<InstantSearch
				indexName={__config.dev_dot.algolia.docsIndexName}
				searchClient={customSearchClient}
			>
				<SearchBox />

				<Index indexName={__config.dev_dot.algolia.docsIndexName}>
					<h2>index: {__config.dev_dot.algolia.docsIndexName}</h2>
					<CustomHits />
				</Index>

				<Index indexName={__config.dev_dot.algolia.tutorialsIndexName}>
					<h2>index: {__config.dev_dot.algolia.tutorialsIndexName}</h2>
					<CustomHits />
				</Index>
			</InstantSearch>
		</>
	)
}

export default SearchTest
