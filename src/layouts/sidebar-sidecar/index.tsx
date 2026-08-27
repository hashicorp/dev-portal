/**
 * Copyright IBM Corp. 2021, 2025
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
import { SkipLinkContext, useMobileMenu, useMobileSubMenu } from 'contexts'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import BaseLayout from 'layouts/base-layout'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import { MobileSubMenuContainer } from 'components/mobile-menu-container'
import Sidebar from 'components/sidebar'
import MobileMenuLevelsGeneric from '@components/mobile-menu-levels-generic'

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
		<BaseLayout mobileMenuSlot={MobileMenuLevelsGeneric()} showFooterTopBorder>
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
	docMetadata,
}: SidebarSidecarLayoutProps) => {
	const mobileMenuContext = useMobileSubMenu()
	const isMobileSubMenuRendered = mobileMenuContext.isMobileMenuRendered
	const mobileSubMenuIsOpen = mobileMenuContext.mobileMenuIsOpen
	const setMobileSubMenuIsOpen = mobileMenuContext.setMobileMenuIsOpen

	const { currentLevel } = useSidebarNavData()
	const { active: sandboxIsActive } = useInstruqtEmbed()
	const sidebarRef = useRef<HTMLDivElement>()
	const sidebarProps = sidebarNavDataLevels[currentLevel]
	const sidebarIsVisible = !isMobileSubMenuRendered || mobileSubMenuIsOpen
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
		() => setMobileSubMenuIsOpen(false),
		isMobileSubMenuRendered && sidebarIsVisible,
	)

	console.log({ sidebarProps })

	let sidebarContent = null
	if (AlternateSidebar && !sidebarProps?.menuItems) {
		sidebarContent = <AlternateSidebar {...sidebarProps} />
	} else {
		sidebarContent = <Sidebar {...sidebarProps} />
	}

	let servedFromBadge = null
	if (docMetadata && process.env.HASHI_ENV === 'unified-docs-sandbox') {
		const servedFrom = docMetadata['served-from']
		if (servedFrom === 'current build' || servedFrom === 'production') {
			const icon = servedFrom === 'production' ? '🟢' : '🟡'
			servedFromBadge = (
				<span className={s.servedFromBadge}>
					{icon} {servedFrom.toUpperCase()}
				</span>
			)
		}
	}

	console.log('Submenu open: ', mobileSubMenuIsOpen)
	console.log(sidebarContent.props.title)
	console.log(AlternateSidebar)

	const shouldNotHaveSidePadding = sidebarContent.props.title === 'Main Menu'

	return (
		<div className={classNames(s.root, s[`mainWidth-${mainWidth}`])}>
			<MobileSubMenuContainer className={s.sidebarContainer} ref={sidebarRef}>
				<div className={s.sidebarContentWrapper}>
					<div
						className={classNames({
							[s.sidePadding]:
								!shouldNotHaveSidePadding || !isMobileSubMenuRendered,
						})}
					>
						{sidebarContent}
					</div>
				</div>
			</MobileSubMenuContainer>
			<div className={s.contentWrapper} ref={contentRef}>
				{alertBannerSlot}
				<div
					className={classNames(s.paddedAreaWrapper, {
						[s.withSandboxPadding]: sandboxIsActive,
					})}
				>
					<div className={s.breadcrumbContainer}>
						<div>
							{breadcrumbLinks ? (
								<BreadcrumbBar links={breadcrumbLinks} />
							) : null}
						</div>
						{servedFromBadge}
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
