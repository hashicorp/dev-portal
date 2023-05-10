import algoliaClient from './client'
import { NormalizedSearchObject } from './types'
import { fetchDocs, formatDoc } from './content-types/docs'
import { fetchTutorials, formatTutorial } from './content-types/tutorials'
import {
	fetchIntegrations,
	formatIntegration,
} from './content-types/integrations'

const algoliaIndex = algoliaClient.initIndex('spike_DEVDOT_omni')

// "Docs" content is in the MKTG_CONTENT_API
const DOCS_API = process.env.MKTG_CONTENT_API

// "Integrations" content is in the INTEGRATIONS_API
const INTEGRATIONS_API = process.env.NEXT_PUBLIC_INTEGRATIONS_API_BASE_URL

// "Tutorials" content is in the LEARN_API
const LEARN_API = process.env.NEXT_PUBLIC_LEARN_API_BASE_URL

async function main() {
	const LIMIT = undefined
	/**
	 * Fetch and format search objects from all sources
	 */
	// Fetch and format "Docs" search objects
	const docsRecords = await fetchDocs(DOCS_API, 3000)
	const docsSearchObjects = docsRecords.map(formatDoc)
	// Fetch and format "Tutorials" search objects
	const tutorialRecords = await fetchTutorials(LEARN_API, LIMIT)
	const tutorialSearchObjects = tutorialRecords.map(formatTutorial)
	// Fetch and format "Integrations" search objects
	const integrationRecords = await fetchIntegrations(INTEGRATIONS_API, LIMIT)
	const integrationSearchObjects = integrationRecords.map(formatIntegration)
	/**
	 * Join all search objects, prefixing each `objectID` appropriately,
	 * and adding a `_type` attribute.
	 */
	function addType(entries: NormalizedSearchObject[], type: string) {
		return entries.map((entry: NormalizedSearchObject) => ({
			...entry,
			_type: type,
			objectID: type + '_' + entry.objectID,
		}))
	}
	const allSearchObjects = [
		...addType(docsSearchObjects, 'docs'),
		...addType(tutorialSearchObjects, 'tutorial'),
		...addType(integrationSearchObjects, 'integration'),
	]
	/**
	 * Push the search objects to Algolia
	 */
	algoliaIndex.saveObjects(allSearchObjects).then(({ objectIDs }) => {
		console.log(objectIDs)
	})
}

main()
