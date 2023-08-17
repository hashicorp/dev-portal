/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import CollectionMeta from 'views/collection-view/components/collection-meta'
import CollectionTutorialList from 'views/collection-view/components/collection-tutorial-list'
import { WellArchitectedFrameworkCollectionViewProps } from '../types'
import { generateWafCollectionSidebar } from '../utils/generate-collection-sidebar'

export default function WellArchitectedFrameworkCollectionView({
	collection,
	layoutProps,
	metadata,
}: WellArchitectedFrameworkCollectionViewProps) {
	const { name, id, description, tutorials, ordered, slug } = collection
	const { sidebarSections, breadcrumbLinks } = layoutProps

	return (
		<SidebarSidecarLayout
			breadcrumbLinks={breadcrumbLinks}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(metadata.wafName) as SidebarProps,
				generateWafCollectionSidebar(
					{ name: metadata.wafName, slug: metadata.wafSlug },
					sidebarSections
				),
			]}
		>
			<CollectionMeta
				collection={collection}
				heading={{ text: name, id }}
				description={description}
			/>
			<CollectionTutorialList
				isOrdered={ordered}
				tutorials={tutorials.map((t: ClientTutorialLite) => ({
					id: t.id,
					collectionId: id,
					description: t.description,
					duration: getReadableTime(t.readTime),
					hasInteractiveLab: Boolean(t.handsOnLab),
					hasVideo: Boolean(t.video),
					heading: t.name,
					url: `/${slug}/${splitProductFromFilename(t.slug)}`,
					productsUsed: t.productsUsed.map((p) => p.product.slug),
				}))}
			/>
		</SidebarSidecarLayout>
	)
}
