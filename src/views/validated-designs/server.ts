/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { isProductSlug } from 'lib/products'
import { HVD_CONTENT_DIR } from '@scripts/extract-hvd-content'
import { HvdCategoryGroup, HvdGuide, HvdPage } from './types'
import { ValidatedDesignsGuideProps } from './guide'

import { serialize } from 'lib/next-mdx-remote/serialize'
import remarkPluginAnchorLinkData, {
	AnchorLinkItem,
} from 'lib/remark-plugins/remark-plugin-anchor-link-data'
import { rewriteStaticHVDAssetsPlugin } from 'lib/remark-plugins/rewrite-static-hvd-assets'
import grayMatter from 'gray-matter'
import { ProductSlug } from 'types/products'
import { OutlineLinkItem } from 'components/outline-nav/types'
import { rehypeCodePlugins } from 'lib/rehype-code-plugins'

const basePath = '/validated-designs'

function loadMetadata(
	path: string
): { title: string; description: string } | null {
	try {
		const data = yaml.load(
			fs.readFileSync(path, {
				encoding: 'utf-8',
			})
		) as { title: string; description: string }
		return data
	} catch (e) {
		console.error(
			'[Error: HVD template] Unable to parse yaml metadata file ',
			e
		)
		return null
	}
}

export function getHvdCategoryGroups(): HvdCategoryGroup[] | null {
	let hvdRepoContents

	try {
		console.info('[HVD]: reading from content directory ', HVD_CONTENT_DIR)
		hvdRepoContents = fs.readdirSync(HVD_CONTENT_DIR, {
			recursive: true,
			encoding: 'utf-8',
		})
	} catch (e) {
		/**
		 * When authors are running locally from content repos,
		 * we want to ignore errors.
		 *
		 * In all other scenarios, we want errors related to HVD content to
		 * surface. This does mean that anyone running `hashicorp/dev-portal`
		 * locally will need to have a valid `GITHUB_TOKEN`.
		 */
		if (process.env.IS_CONTENT_PREVIEW) {
			console.warn(
				`[Error]: HVD content was not found, and will not be built. If you need to work on HVD content, please ensure a valid GITHUB_TOKEN is present in your environment variables. Error: ${e}`
			)
		} else {
			console.error(
				`[Error]: HVD content was not found, and will not be built. If you need to work on HVD content, please ensure a valid GITHUB_TOKEN is present in your environment variables. Error: ${e}`
			)
		}

		return null
	}

	if (!hvdRepoContents) {
		return null
	}

	const configFiles = hvdRepoContents.filter((item: string) =>
		item.endsWith('.yaml')
	)

	/**
	 * We need to find the category and hvd guides within a category
	 * We'll target the index.yaml files in the root of both category and hvd guide directories
	 *
	 * Then we build the category groups based on the contents of the metadata files.
	 * Each category should have an array of guides associated with it.
	 * There should be one category metadata file, but many guide metadata files.
	 */
	const hvdCategoryGroups: HvdCategoryGroup[] = []
	configFiles.forEach((item: string) => {
		// Expected fs structure /<product>/<category>/<hvdGuide>
		// e.g. terraform/operation-guides/adoption
		const pathParts = item.split('/')
		const [product, category] = pathParts

		const metadata = loadMetadata(path.join(HVD_CONTENT_DIR, item))
		if (!metadata) {
			return
		}

		// We assume category config files have 3 path parts, and hvd guide configs have 4 parts
		const isCategoryMetadata = pathParts.length === 3
		const isHvdMetadata = pathParts.length === 4

		const slug = `${product}-${category}`
		if (isCategoryMetadata) {
			hvdCategoryGroups.push({
				slug,
				title: metadata.title,
				description: metadata.description,
				productSlug: (isProductSlug(product) ? product : 'hcp') as Exclude<
					ProductSlug,
					'sentinel'
				>,
				guides: [],
			})
		} else if (isHvdMetadata) {
			// find the existing HvdCategoryGroup, because we traverse the files in order the HvdCategoryGroup YAML will always come before the HvdGuide YAML
			const categoryGroup = hvdCategoryGroups.find(
				(categoryGroup: HvdCategoryGroup) => {
					return categoryGroup.slug === slug
				}
			)

			const guideSlug = pathParts[2]
			const categorySlug = `${slug}-${guideSlug}`

			// build the category group
			const pagesPath = path.join(product, category, guideSlug)
			const pagesFiles = hvdRepoContents.filter((path: string) => {
				return path.includes(pagesPath) && path.endsWith('.mdx')
			})
			const pages = pagesFiles.map((pagePath: string) => {
				const pagePathParts = pagePath.split('/')
				const pageFileName = pagePathParts[pagePathParts.length - 1]
				const filePath = path.join(HVD_CONTENT_DIR, pagePath)

				const pageSlug = pageFileName
					.replace('.mdx', '')
					.substring(pageFileName.indexOf('-') + 1)
					.toLocaleLowerCase()

				// TODO: this should be guarded with a try catch
				const pageMDXString = fs.readFileSync(filePath, 'utf8')
				const { data: frontMatter } = grayMatter(pageMDXString)

				return {
					slug: pageSlug,
					// this is temporary as we should always have these fields in the markdown
					title: frontMatter?.title || '⛔ ERROR NO MARKDOWN TITLE ⛔',
					filePath,
					href: `${basePath}/${categorySlug}/${pageSlug}`,
				}
			})

			categoryGroup.guides.push({
				slug: categorySlug,
				title: metadata.title,
				description: metadata.description,
				href: `${basePath}/${categorySlug}`,
				pages,
			})
		}
	})

	return hvdCategoryGroups
}

export function getHvdCategoryGroupsPaths(
	categoryGroups: HvdCategoryGroup[]
): string[][] {
	// [[guide-slug], [guide-slug, page-slug]]
	// e.g. [[terraform-operation-guide-adoption], [terraform-operation-guide-adoption, page-slug]]
	return categoryGroups.flatMap((categoryGroup: HvdCategoryGroup) =>
		categoryGroup.guides.flatMap((guide: HvdGuide) => [
			[guide.slug],
			...guide.pages.map((page: HvdPage) => [guide.slug, page.slug]),
		])
	)
}

export async function getHvdGuidePropsFromSlug(
	categoryGroups: HvdCategoryGroup[],
	slug: string[]
): Promise<ValidatedDesignsGuideProps | null> {
	const [guideSlug, pageSlug] = slug

	const validatedDesignsGuideProps: ValidatedDesignsGuideProps = {
		metadata: {
			title: '',
			description: '',
		},
		guideTitle: '',
		productSlug: 'hcp', // default to hcp
		markdown: {
			mdxSource: null,
		},
		headers: [],
		currentPageIndex: 0,
		basePath,
		pages: [],
	}

	for (const categoryGroup of categoryGroups) {
		for (const guide of categoryGroup.guides) {
			if (guide.slug === guideSlug) {
				validatedDesignsGuideProps.productSlug = categoryGroup.productSlug

				for (let index = 0; index < guide.pages.length; index++) {
					const page = guide.pages[index]

					// If no pageSlug is provided, default to the first page
					if (page.slug === pageSlug || (!pageSlug && index === 0)) {
						validatedDesignsGuideProps.guideTitle = guide.title

						let mdxFileString: string
						try {
							mdxFileString = fs.readFileSync(page.filePath, 'utf8')
						} catch (err) {
							console.error(err)
							return null
						}

						const anchorLinks: AnchorLinkItem[] = []
						const { data: frontMatter, content } = grayMatter(mdxFileString)

						const mdxSource = await serialize(content, {
							mdxOptions: {
								remarkPlugins: [
									[remarkPluginAnchorLinkData, { anchorLinks }],
									rewriteStaticHVDAssetsPlugin,
								],
								rehypePlugins: [...rehypeCodePlugins],
							},
						})

						// only show heading level 1 & 2
						const headers = anchorLinks.reduce(
							(acc: OutlineLinkItem[], anchorLink: AnchorLinkItem) => {
								if (anchorLink.level < 3) {
									acc.push({
										title: anchorLink.title,
										url: `#${anchorLink.id}`,
									})
								}

								return acc
							},
							[]
						)

						validatedDesignsGuideProps.headers = headers
						validatedDesignsGuideProps.metadata = {
							// this is temporary as we should always have these fields in the markdown
							description:
								frontMatter?.description ||
								'⛔ ERROR NO MARKDOWN DESCRIPTION ⛔',
							title: frontMatter?.title
								? `${guide.title} | ${frontMatter?.title}`
								: '⛔ ERROR NO MARKDOWN TITLE ⛔',
						}
						validatedDesignsGuideProps.markdown = {
							mdxSource,
						}
						validatedDesignsGuideProps.currentPageIndex = index
					}

					validatedDesignsGuideProps.pages.push(page)
				}

				return validatedDesignsGuideProps
			}
		}
	}

	return null
}
