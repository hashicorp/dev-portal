/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import {
	Collection as ApiCollection,
	TutorialLite as ApiTutorialLite,
} from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import WellArchitectedFrameworkTutorialView from 'views/well-architected-framework/tutorial-view'
import { getWafTutorialViewProps } from 'views/well-architected-framework/tutorial-view/server'
import wafData from 'data/well-architected-framework.json'
import { WafTutorialViewProps } from 'views/well-architected-framework/types'
import { GetStaticPropsContext } from 'next'

export async function getStaticProps({
	params,
}: GetStaticPropsContext<{ tutorialSlug: [string, string] }>): Promise<
	{ props: WafTutorialViewProps } | { notFound: boolean }
> {
	const props = await getWafTutorialViewProps(params.tutorialSlug)

	// If the tutorial doesn't exist, hit the 404
	if (!props) {
		return { notFound: true }
	}
	return props
}

export async function getStaticPaths() {
	const allCollections = await getCollectionsBySection(wafData.slug)
	const paths = []
	allCollections.forEach((c: ApiCollection) => {
		const collectionSlug = splitProductFromFilename(c.slug)
		c.tutorials.forEach(({ slug }: { slug: ApiTutorialLite['slug'] }) =>
			paths.push({
				params: {
					tutorialSlug: [collectionSlug, splitProductFromFilename(slug)],
				},
			})
		)
	})

	return { paths, fallback: false }
}

export default WellArchitectedFrameworkTutorialView
