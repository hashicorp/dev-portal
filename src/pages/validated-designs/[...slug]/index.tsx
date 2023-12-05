/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ValidatedDesignGuideView from 'views/validated-designs/guide'
import {
	getHvdCategoryGroupsPaths,
	getHvdGuidePropsFromSlugs,
} from 'views/validated-designs/server'

// @TODO make sure to set it up so that the base `guideSlug` path redirects to the first section page
// for example /validated-designs/terraform-operation-guides-adoption would render the content for
// /validated-designs/terraform-operation-guides-adoption/0000-introduction
export async function getStaticPaths() {
	const pagePaths = getHvdCategoryGroupsPaths()

	return {
		paths: [
			...pagePaths.map((path: string[]) => ({
				params: {
					slug: path,
				},
			})),
		],
		fallback: false,
	}
}

export async function getStaticProps(context) {
	/** @TODO remove this conditional after release */
	if (__config.flags.enable_hvd === false) {
		return {
			notFound: true,
		}
	}

	const slugs = context.params.slug
	const props = await getHvdGuidePropsFromSlugs(slugs)

	return {
		props,
	}
}

export default ValidatedDesignGuideView
