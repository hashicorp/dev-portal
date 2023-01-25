import { Fragment } from 'react'

import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import {
	SidebarHorizontalRule,
	SidebarSectionHeading,
	SidebarNavMenuItem,
	SidebarNavHighlightItem,
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
import { useRouter } from 'next/router'
import { ProductSlug } from 'types/products'

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
	productSlug,
}: {
	sections: CollectionCategorySidebarSection[]
	productSlug: ProductSlug
}) {
	return (
		<>
			<TutorialsOverviewItem productSlug={productSlug} />
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

function TutorialsOverviewItem({ productSlug }: { productSlug: ProductSlug }) {
	const router = useRouter()
	const overviewItemHref = `/${productSlug}/tutorials`

	return (
		<SidebarNavHighlightItem
			text="Tutorials"
			href={overviewItemHref}
			theme={productSlug}
			isActive={router.asPath === overviewItemHref}
		/>
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
