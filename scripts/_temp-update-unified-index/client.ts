import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_WRITE_API_KEY = process.env.ALGOLIA_WRITE_API_KEY

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY)

export default client
