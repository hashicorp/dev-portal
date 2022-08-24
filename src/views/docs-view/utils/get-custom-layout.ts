import { RootDocsPath } from 'types/products'

/**
 * TODO: this logic is temporary to showcase how layouts can work.
 * Going forward this would be defined in frontmatter,
 * we'd pass frontmatter.layout directly rather than constructing this.
 *
 * Task: https://app.asana.com/0/1202097197789424/1202850056121889/f
 */
export function getCustomLayout({
	currentRootDocsPath,
	frontMatter,
	pathParts,
}: {
	currentRootDocsPath: RootDocsPath
	frontMatter: Record<string, unknown>
	pathParts: string[]
}) {
	const isLanding = pathParts.length === 0
	const customLayout = isLanding
		? {
				name: 'docs-root-landing',
				subtitle:
					currentRootDocsPath.description ?? frontMatter.description ?? null,
		  }
		: null
	return customLayout
}
