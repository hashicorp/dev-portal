import { generateTutorialMap } from 'pages/api/tutorials-map'
import { makeSitemapElement } from './helpers'

export async function allTutorialsUrls() {
	const tutorialPaths = await generateTutorialMap()
	return Object.entries(tutorialPaths).map(([_, slug]: [string, string]) =>
		makeSitemapElement({ slug })
	)
}
