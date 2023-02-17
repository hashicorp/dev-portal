/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { ReactElement, useRef } from 'react'
import classNames from 'classnames'

// Global imports
import { MAIN_ELEMENT_ID } from 'constants/element-ids'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import { useScroll } from 'framer-motion'
import { useMobileMenu } from 'contexts'
import BaseLayout from 'layouts/base-new'
import TableOfContents from 'layouts/sidebar-sidecar/components/table-of-contents'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import Sidebar from 'components/sidebar'

// Local imports
import { SidebarSidecarLayoutProps } from './types'
import {
	SidebarNavDataProvider,
	useSidebarNavData,
} from './contexts/sidebar-nav-data'
import { ScrollProgressBar } from './components/scroll-progress-bar'
import { filterTableOfContentsHeadings } from './utils/filter-table-of-contents-headings'
import s from './sidebar-sidecar-layout.module.css'

const SidebarSidecarLayout = (props: SidebarSidecarLayoutProps) => {
	const navDataLevels = props.sidebarNavDataLevels
	return (
		<BaseLayout showFooterTopBorder>
			<SidebarNavDataProvider navDataLevels={navDataLevels}>
				<SidebarSidecarLayoutContent {...props} />
			</SidebarNavDataProvider>
		</BaseLayout>
	)
}

const SidebarSidecarLayoutContent = ({
	breadcrumbLinks,
	children,
	githubFileUrl,
	headings,
	AlternateSidebar,
	showScrollProgress,
	sidecarSlot,
	sidebarNavDataLevels,
	mainWidth = 'wide',
	alertBannerSlot,
}: SidebarSidecarLayoutProps) => {
	const { isMobileMenuRendered, mobileMenuIsOpen, setMobileMenuIsOpen } =
		useMobileMenu()
	const { currentLevel } = useSidebarNavData()
	const sidebarRef = useRef<HTMLDivElement>()
	const sidebarProps = sidebarNavDataLevels[currentLevel]
	const sidebarIsVisible = !isMobileMenuRendered || mobileMenuIsOpen
	const contentRef = useRef(null)

	const stickyNavHeaderHeight = getFullNavHeaderHeight()
	const { scrollYProgress } = useScroll({
		target: contentRef,
		/**
		 * Note: sticky elements are not registered during scroll, so we need
		 * to account for the stick nav height with an offset to ensure accuracy.
		 */
		offset: [`${stickyNavHeaderHeight * -1}px start`, `end end`],
	})

	// Handles closing the sidebar if focus moves outside of it and it is open.
	useOnFocusOutside(
		[sidebarRef],
		() => setMobileMenuIsOpen(false),
		isMobileMenuRendered && sidebarIsVisible
	)

	let sidebarContent = null
	if (AlternateSidebar && !sidebarProps?.menuItems) {
		sidebarContent = <AlternateSidebar {...sidebarProps} />
	} else {
		sidebarContent = <Sidebar {...sidebarProps} />
	}

	const SidecarContent = (): ReactElement => {
		if (typeof sidecarSlot !== 'undefined') {
			return sidecarSlot
		}

		return (
			<TableOfContents headings={filterTableOfContentsHeadings(headings)} />
		)
	}

	return (
		<div className={classNames(s.root, s[`mainWidth-${mainWidth}`])}>
			<MobileMenuContainer className={s.mobileMenuContainer} ref={sidebarRef}>
				<div className={s.sidebarContentWrapper}>
					<MobileAuthenticationControls />
					{sidebarContent}
				</div>
			</MobileMenuContainer>
			<div className={s.contentWrapper} ref={contentRef}>
				{alertBannerSlot ? alertBannerSlot : null}
				<div className={s.mainAreaWrapper}>
					<main id={MAIN_ELEMENT_ID} className={s.main}>
						<span className={s.breadcrumbOptOutGroup}>
							{breadcrumbLinks && <BreadcrumbBar links={breadcrumbLinks} />}
						</span>
						{children}
						{githubFileUrl && (
							<EditOnGithubLink
								className={s.editOnGithubLink}
								url={githubFileUrl}
								label="Edit this page on GitHub"
							/>
						)}
					</main>
					<div className={s.sidecarWrapper}>
						<SidecarContent />
					</div>
				</div>
				{showScrollProgress ? (
					<ScrollProgressBar progress={scrollYProgress} />
				) : null}
			</div>
		</div>
	)
}

export type { SidebarSidecarLayoutProps }
export default SidebarSidecarLayout
