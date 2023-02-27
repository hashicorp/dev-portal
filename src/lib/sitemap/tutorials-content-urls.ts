import { generateTutorialMap } from 'pages/api/tutorials-map'
import { makeSitemapElement } from './helpers'

export async function allTutorialsUrls() {
	const tutorialPaths = await generateTutorialMap()
	return Object.values(tutorialPaths).map((slug: string) =>
		makeSitemapElement({ slug })
	)
}
