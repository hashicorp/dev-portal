/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useMemo } from 'react'
// Hooks
import { useCollectionProgress } from 'hooks/progress'
import { useTutorialProgress } from 'hooks/progress'
// Components
import {
	CollectionProgressStatusSection,
	parseCollectionProgress,
} from 'components/collection-progress-group'
import TutorialProgressIcon from 'components/tutorial-progress-icon'
import { SidebarNavMenuItem } from 'components/sidebar/components'
import { SectionList } from 'components/tutorials-sidebar'
import { ErrorBoundary } from 'components/error-boundary'
// Types
import { TutorialListItemProps } from 'components/tutorials-sidebar/types'
// Styles
import s from './tutorial-view-sidebar-content.module.css'
import { Collection } from 'lib/learn-client/types'
import React from 'react'

/**
 * Renders sidebar content for tutorial views.
 */
function TutorialViewSidebarContent({
	collection,
	items,
}: {
	collection: Collection
	items: TutorialListItemProps[]
}) {
	return (
		<>
			<CollectionProgress collection={collection} />
			<SectionList>
				{items.map((item: TutorialListItemProps) => {
					return (
						<TutorialListItem
							key={`${item.collectionId}${item.tutorialId}`}
							text={item.text}
							href={item.href}
							isActive={item.isActive}
							tutorialId={item.tutorialId}
							collectionId={item.collectionId}
						/>
					)
				})}
			</SectionList>
		</>
	)
}

/**
 * Displays collection progress status.
 */
function CollectionProgress({ collection }: { collection: Collection }) {
	const { id, slug, tutorials } = collection ?? {}

	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: progressData, isLoading } = useCollectionProgress({
		collectionId: id,
	})

	/**
	 * Parse the progress-related information we need from the progress records,
	 * current collection slug, and list of tutorials in this collection.
	 */
	const { completedTutorialCount, tutorialCount, isInProgress } =
		useMemo(() => {
			if (!collection || !id || !tutorials) {
				return {
					completedTutorialCount: 0,
					tutorialCount: 0,
					isInProgress: false,
				}
			}
			return parseCollectionProgress(progressData, tutorials.length, {
				id,
				slug,
			})
		}, [progressData, tutorials, id, slug, collection])

	return (
		<div className={s.collectionProgressContainer}>
			{!isLoading && collection && id && tutorials && (
				<CollectionProgressStatusSection
					completedTutorialCount={completedTutorialCount}
					tutorialCount={tutorialCount}
					isInProgress={isInProgress}
				/>
			)}
		</div>
	)
}

/**
 * Renders a tutorial nav menu item, which is a menu item with
 * an optional progress status indicator for authenticated users.
 */
function TutorialListItem({
	href,
	isActive,
	text,
	tutorialId,
	collectionId,
}: TutorialListItemProps) {
	/**
	 * Query for progress if we have valid IDs
	 */
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})

	/**
	 * Only show the progress icon if we have valid IDs
	 */
	const trailingIcon =
		tutorialId && collectionId ? (
			<TutorialProgressIcon
				status={tutorialProgressStatus}
				isActive={isActive}
			/>
		) : null

	return (
		<SidebarNavMenuItem item={{ isActive, title: text, href, trailingIcon }} />
	)
}

function TutorialViewSidebarContentWithBoundary(props) {
	return (
		<ErrorBoundary>
			<TutorialViewSidebarContent {...props} />
		</ErrorBoundary>
	)
}

export default TutorialViewSidebarContentWithBoundary
