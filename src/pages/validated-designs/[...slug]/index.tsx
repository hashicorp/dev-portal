/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import ValidatedDesignGuideView from 'views/validated-designs/guide'
import {
	getHvdCategoryGroups,
	getHvdCategoryGroupsPaths,
	getHvdGuidePropsFromSlug,
} from 'views/validated-designs/server'

export async function getStaticPaths() {
	const categoryGroups = getHvdCategoryGroups()
	if (!categoryGroups) {
		return {
			paths: [],
			fallback: false,
		}
	}

	const pagePaths = getHvdCategoryGroupsPaths(categoryGroups)

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
	const categoryGroups = getHvdCategoryGroups()
	if (!categoryGroups) {
		return {
			notFound: true,
		}
	}

	const slug = context.params.slug
	const props = await getHvdGuidePropsFromSlug(categoryGroups, slug)
	if (!props) {
		return {
			notFound: true,
		}
	}

	return {
		props,
	}
}

export default ValidatedDesignGuideView
