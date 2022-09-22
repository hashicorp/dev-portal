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
// Types
import { TutorialListItemProps } from 'components/tutorials-sidebar/types'
// Styles
import s from './tutorial-view-sidebar-content.module.css'
import { Collection } from 'lib/learn-client/types'

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
	const { id, slug, tutorials } = collection

	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: progressData } = useCollectionProgress({ collectionId: id })

	/**
	 * Parse the progress-related information we need from the progress records,
	 * current collection slug, and list of tutorials in this collection.
	 */
	const { completedTutorialCount, tutorialCount, isInProgress } = useMemo(
		() => parseCollectionProgress(progressData, tutorials, { id, slug }),
		[progressData, tutorials, id, slug]
	)

	return (
		<div className={s.collectionProgressContainer}>
			<CollectionProgressStatusSection
				completedTutorialCount={completedTutorialCount}
				tutorialCount={tutorialCount}
				isInProgress={isInProgress}
			/>
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
	 * Query for progress, and display the appropriate status icon
	 */
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})
	const trailingIcon = <TutorialProgressIcon status={tutorialProgressStatus} />

	return (
		<SidebarNavMenuItem item={{ isActive, title: text, href, trailingIcon }} />
	)
}

export default TutorialViewSidebarContent
