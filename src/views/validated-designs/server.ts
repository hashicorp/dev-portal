/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { isProductSlug } from 'lib/products'
// @TODO create an alias for root dir
import { HVD_CONTENT_DIR } from '../../../scripts/extract-hvd-content'
import { ValidatedDesignsLandingProps } from '.'

function loadMetadata(path: string): { title: string; description: string } {
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
	}
}

export function getHvdLandingProps(): ValidatedDesignsLandingProps {
	const hvdRepoContents = fs.readdirSync(HVD_CONTENT_DIR, {
		recursive: true,
		encoding: 'utf-8',
	})
	const configFiles = hvdRepoContents.filter((item: string) =>
		item.endsWith('.yaml')
	)
	const categoryGroups = {}

	/**
	 * We need to find the category and hvd guides within a category
	 * We'll target the index.yaml files in the root of both category and hvd guide directories
	 *
	 * Then we build the category groups based on the contents of the metadata files.
	 * Each category should have an array of guides associated with it.
	 * There should be one category metadata file, but many guide metadata files.
	 *
	 * Note, is a spike and the code could be cleaned up / reformatted as per the needs of the view!
	 */
	configFiles.forEach((item: string) => {
		// Expected fs structure /<product>/<category>/<hvdGuide>
		const pathParts = item.split('/')
		const [product] = pathParts
		// We assume category config files have 3 path parts, and hvd guide configs have 4 parts
		const isCategoryMetadata = pathParts.length === 3
		const isHvdMetadata = pathParts.length === 4
		// Join together /<product>-<category>
		const categorySlug = pathParts.slice(0, 2).join('-')

		// Guard so that we only work with valid product directories
		if (!isProductSlug(product)) {
			return
		}

		if (isCategoryMetadata) {
			const { title, description } = loadMetadata(
				path.join(HVD_CONTENT_DIR, item)
			)
			categoryGroups[categorySlug] = {
				slug: categorySlug,
				product,
				title: title,
				description: description,
				guides: [],
			}
		} else if (isHvdMetadata) {
			const { title, description } = loadMetadata(
				path.join(HVD_CONTENT_DIR, item)
			)
			const guideSlug = `/validated-designs/${pathParts.slice(0, -1).join('-')}`

			// This assumes the property is already set, @TODO harden this
			categoryGroups[categorySlug].guides = [
				{
					slug: guideSlug,
					title,
					description,
					href: guideSlug,
				},
				...categoryGroups[categorySlug].guides,
			]
		}
	})

	// @TODO — the title and description should be sourced from the content repo
	return {
		title: 'HashiCorp Validated Designs',
		description:
			'@TODO lorem ipsum the rain in Spain stays mainly in the plains.',
		categoryGroups: Object.values(categoryGroups),
	}
}
