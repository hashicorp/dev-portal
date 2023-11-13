import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { isProductSlug } from 'lib/products'
// TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'
import { ValidatedDesignsLandingProps } from '.'

/**
 * TODO reorganize data structure to return an array of
 * category groups to match ValidatedDesignsLandingProps
 */

/**
 * Walk into each product dir
 *
 * 1. recursively read the contents of the product dir
 * 2. get the category metadata
 * 3. get the guide metadata
 *
 * - I don't care about the mdx files...so I don't need to walk the guide dir
 */

export function getHvdLandingProps(): ValidatedDesignsLandingProps {
	// @TODO refactor to support all products based on Products type src/types/products.ts
	const hvdRepoContents = fs.readdirSync(HVD_CONTENT_DIR, {
		recursive: true,
		encoding: 'utf-8',
	})

	const configFiles = hvdRepoContents.filter((item: string) =>
		item.endsWith('.yaml')
	)

	const categoryGroups = {}

	configFiles.forEach((item: string) => {
		// we assume category config files have 3 path parts, and hvd guide configs have 4 parts
		// based on fs structure /<product>/<category>/<hvdGuide>
		const pathParts = item.split('/')
		const [product] = pathParts
		const isCategoryMetadata = pathParts.length === 3
		const isHvdMetadata = pathParts.length === 4

		// guard so that we only work with valid product directories
		if (!isProductSlug(product)) {
			return
		}

		if (isCategoryMetadata) {
			// join together /<product>-<category>
			const categorySlug = pathParts.slice(0, -1).join('-')
			// TODO put in a try / catch. Give author feedback if expected metadata isn't there
			const { title, description } = yaml.load(
				fs.readFileSync(path.join(HVD_CONTENT_DIR, item), {
					encoding: 'utf-8',
				})
			) as { title: string; description: string }
			console.log(
				'in category meta',
				categoryGroups[categorySlug],
				categorySlug
			)
			categoryGroups[categorySlug] = {
				slug: categorySlug,
				product,
				title: title,
				description: description,
				guides: [],
			}
		} else if (isHvdMetadata) {
			// join together /<product>-<category>
			const categorySlug = pathParts.slice(0, -2).join('-')
			// TODO put in a try / catch. Give author feedback if expected metadata isn't there
			const { title, description } = yaml.load(
				fs.readFileSync(path.join(HVD_CONTENT_DIR, item), { encoding: 'utf-8' })
			) as { title: string; description: string }
			const hvdSlug = pathParts.slice(0, -1).join('-')
			console.log('in hvd meta', categoryGroups[categorySlug], categorySlug)

			// this assumes the category is already created, TODO harden this
			categoryGroups[categorySlug].guides = {
				title,
				description,
				href: hvdSlug,
			}
		}
	})

	const files = []
	hvdRepoContents.forEach((path: string) => {
		if (path.endsWith('.mdx')) {
			const [product, category, hvdName, hvdSectionFile] = path.split('/')
			const hvdSectionPath = `/validated-designs/${product}-${category}-${hvdName}/${hvdSectionFile}`
			files.push({ path: hvdSectionPath })
		}
	})

	return {
		title: 'HashiCorp Validated Designs',
		description:
			'TODO lorem ipsum the rain in Spain stays mainly in the plains.',
		categoryGroups: Object.values(categoryGroups),
		_tmp: files,
	}
}
