/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { useContext, useEffect, useRef } from 'react'
import classNames from 'classnames'

// Global imports
import { MAIN_ELEMENT_ID } from 'constants/element-ids'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import { useScroll } from 'framer-motion'
import { SkipLinkContext, useMobileMenu } from 'contexts'
import BaseLayout from 'layouts/base-layout'
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
import { ScrollProgressBar, SidecarScrollContainer } from './components'
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
	AlternateSidebar,
	showScrollProgress,
	sidecarSlot,
	sidecarTopSlot,
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
	const { setShowSkipLink } = useContext(SkipLinkContext)
	const stickyNavHeaderHeight = getFullNavHeaderHeight()
	const { scrollYProgress } = useScroll({
		target: contentRef,
		/**
		 * Note: sticky elements are not registered during scroll, so we need
		 * to account for the stick nav height with an offset to ensure accuracy.
		 */
		offset: [`${stickyNavHeaderHeight * -1}px start`, `end end`],
	})

	useEffect(() => {
		setShowSkipLink(true)

		return () => {
			setShowSkipLink(false)
		}
	}, [setShowSkipLink])

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

	const shouldNotHaveSidePadding =
		sidebarContent.props.title === 'Main Menu' ||
		(AlternateSidebar && !sidebarProps?.menuItems)

	return (
		<div className={classNames(s.root, s[`mainWidth-${mainWidth}`])}>
			<MobileMenuContainer className={s.sidebarContainer} ref={sidebarRef}>
				<div className={s.sidebarContentWrapper}>
					<MobileAuthenticationControls
						className={classNames(
							s.mobileAuthControlsContainer,
							s.sidePadding,
							{ [s.noMargin]: AlternateSidebar && !sidebarProps?.menuItems }
						)}
					/>
					<div
						className={classNames({
							[s.sidePadding]:
								!shouldNotHaveSidePadding || !isMobileMenuRendered,
						})}
					>
						{sidebarContent}
					</div>
				</div>
			</MobileMenuContainer>
			<div className={s.contentWrapper} ref={contentRef}>
				{alertBannerSlot}
				<div className={s.paddedAreaWrapper}>
					<div className={s.breadcrumbContainer}>
						<div className={s.breadcrumbMaxWidth}>
							{breadcrumbLinks ? (
								<BreadcrumbBar links={breadcrumbLinks} />
							) : null}
						</div>
					</div>
					<div className={s.mainAndSidecar}>
						<main id={MAIN_ELEMENT_ID} className={s.main}>
							{children}
							{githubFileUrl ? (
								<EditOnGithubLink
									className={s.editOnGithubLink}
									url={githubFileUrl}
									label="Edit this page on GitHub"
								/>
							) : null}
						</main>
						<div className={s.sidecarPosition}>
							<div className={s.sidecarTopSlot}>{sidecarTopSlot}</div>
							<SidecarScrollContainer>{sidecarSlot}</SidecarScrollContainer>
						</div>
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
