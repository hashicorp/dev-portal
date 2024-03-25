/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { extractingHvdContent } from '@scripts/extract-hvd-content'
import ValidatedDesignGuideView from 'views/validated-designs/guide'
import {
	getHvdCategoryGroups,
	getHvdCategoryGroupsPaths,
	getHvdGuidePropsFromSlug,
} from 'views/validated-designs/server'

export async function getStaticPaths() {
	const failureState = {
		paths: [],
		fallback: false,
	}

	const extractionResults = await extractingHvdContent
	if (extractionResults.status === 'failure') {
		return failureState
	}

	const categoryGroups = getHvdCategoryGroups()
	if (!categoryGroups) {
		return failureState
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
	const failureState = {
		notFound: true,
	}

	const extractionResults = await extractingHvdContent
	if (extractionResults.status === 'failure') {
		return failureState
	}

	const categoryGroups = getHvdCategoryGroups()
	if (!categoryGroups) {
		return failureState
	}

	const slug = context.params.slug
	const props = await getHvdGuidePropsFromSlug(categoryGroups, slug)
	if (!props) {
		return failureState
	}

	return {
		props,
	}
}

export default ValidatedDesignGuideView
