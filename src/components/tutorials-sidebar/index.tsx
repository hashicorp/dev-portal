import { Fragment } from 'react'

import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import {
	SidebarHorizontalRule,
	SidebarSectionHeading,
	SidebarNavMenuItem,
} from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import { useTutorialProgress } from 'hooks/progress'
import {
	ListItemProps,
	SectionListProps,
	SectionTitleProps,
	TutorialListItemProps,
	TutorialSidebarProps,
} from './types'
import TutorialProgressIcon from './tutorial-progress-icon'
import s from './tutorials-sidebar.module.css'

function TutorialsSidebar({
	backToLinkProps,
	children,
	levelButtonProps,
	overviewItemHref,
	title,
	visuallyHideTitle,
}: TutorialSidebarProps) {
	return (
		<Sidebar
			backToLinkProps={backToLinkProps}
			levelButtonProps={levelButtonProps}
			overviewItemHref={overviewItemHref}
			showFilterInput={false}
			title={title}
			visuallyHideTitle={visuallyHideTitle}
		>
			{children}
		</Sidebar>
	)
}

function CollectionViewSidebarContent({
	sections,
}: {
	sections: CollectionCategorySidebarSection[]
}) {
	return (
		<>
			{sections?.map(({ title, items }: CollectionCategorySidebarSection) => {
				return (
					<Fragment key={title}>
						<HorizontalRule />
						{title ? <SectionTitle text={title} /> : null}
						<SectionList>
							{items.map(({ text, href, isActive }: ListItemProps) => {
								return (
									<ListItem
										key={`${text}${href}`}
										text={text}
										href={href}
										isActive={isActive}
									/>
								)
							})}
						</SectionList>
					</Fragment>
				)
			})}
		</>
	)
}

function TutorialViewSidebarContent({
	items,
}: {
	items: TutorialListItemProps[]
}) {
	return (
		<SectionList>
			{items.map(
				({
					text,
					href,
					isActive,
					tutorialId,
					collectionId,
				}: TutorialListItemProps) => {
					return (
						<TutorialListItem
							key={`${collectionId}${tutorialId}`}
							text={text}
							href={href}
							isActive={isActive}
							tutorialId={tutorialId}
							collectionId={collectionId}
						/>
					)
				}
			)}
		</SectionList>
	)
}

function SectionList({ children }: SectionListProps) {
	return <ul className={s.listRoot}>{children}</ul>
}

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

function ListItem({ href, isActive, text }: ListItemProps) {
	return <SidebarNavMenuItem item={{ isActive, title: text, href }} />
}

function SectionTitle({ text }: SectionTitleProps) {
	return <SidebarSectionHeading text={text} />
}

function HorizontalRule() {
	return <SidebarHorizontalRule />
}

export {
	CollectionViewSidebarContent,
	HorizontalRule,
	ListItem,
	SectionList,
	SectionTitle,
	TutorialViewSidebarContent,
}
export default TutorialsSidebar
