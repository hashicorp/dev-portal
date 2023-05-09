import algoliasearch from 'algoliasearch'

// Instantiate an Algolia client
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
const algoliaClient = algoliasearch(appId, apiKey)

// Add the search endpoint
export default async function handler(req, res) {
	const { requests } = req.body
	const results = await algoliaClient.search(
		requests.map((r) => {
			return { ...r, getRankingInfo: true }
		})
	)
	res.status(200).json(results)
}
