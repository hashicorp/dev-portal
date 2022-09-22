import { Fragment } from 'react'

import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import {
	SidebarHorizontalRule,
	SidebarSectionHeading,
	SidebarNavMenuItem,
} from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import TutorialViewSidebarContent from './components/tutorial-view-sidebar-content'
import {
	ListItemProps,
	SectionListProps,
	SectionTitleProps,
	TutorialSidebarProps,
} from './types'
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
							{items.map(({ text, href, isActive, badge }: ListItemProps) => {
								return (
									<ListItem
										key={`${text}${href}`}
										text={text}
										href={href}
										isActive={isActive}
										badge={badge}
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

function SectionList({ children }: SectionListProps) {
	return <ul className={s.listRoot}>{children}</ul>
}

function ListItem({ href, isActive, text, badge }: ListItemProps) {
	return <SidebarNavMenuItem item={{ isActive, title: text, href, badge }} />
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
