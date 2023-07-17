/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import HashiHead from '@hashicorp/react-head'
import { TutorialLite as ClientTutorialLite } from 'lib/learn-client/types'
import { splitProductFromFilename } from 'views/tutorial-view/utils'
import getReadableTime from 'components/tutorial-meta/components/badges/helpers'
import CollectionMeta from 'views/collection-view/components/collection-meta'
import CollectionTutorialList from 'views/collection-view/components/collection-tutorial-list'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import { SidebarProps } from 'components/sidebar'
import { OnboardingCollectionViewProps } from '../types'

export default function OnboardingCollectionView({
	collection,
	layoutProps,
	metadata,
}: OnboardingCollectionViewProps) {
	const { name, id, description, tutorials, ordered, slug } = collection

	return (
		<>
			<HashiHead>
				<meta name="robots" content="noindex, nofollow" />
			</HashiHead>
			<SidebarSidecarLayout
				breadcrumbLinks={layoutProps.breadcrumbLinks}
				sidebarNavDataLevels={[
					generateTopLevelSidebarNavData(
						metadata.onboardingName
					) as SidebarProps,
					{
						title: metadata.onboardingName,
						levelButtonProps: {
							levelUpButtonText: `Main Menu`,
							levelDownButtonText: 'Previous',
						},
						showFilterInput: false,

						menuItems: layoutProps.sidebarSections,
					},
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
		</>
	)
}
