/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import { useRef } from 'react'
import classNames from 'classnames'

// HashiCorp imports
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'

// Global imports
import { MAIN_ELEMENT_ID } from 'constants/element-ids'
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import getFullNavHeaderHeight from 'lib/get-full-nav-header-height'
import useOnFocusOutside from 'hooks/use-on-focus-outside'
import useCurrentPath from 'hooks/use-current-path'
import { useScroll } from 'framer-motion'
import { useMobileMenu } from 'contexts'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import EditOnGithubLink from 'components/edit-on-github-link'
import InlineLink from 'components/inline-link'
import MobileMenuContainer, {
	MobileAuthenticationControls,
} from 'components/mobile-menu-container'
import PageAlert from 'components/page-alert'
import Sidebar from 'components/sidebar'

// Local imports
import { SidebarSidecarLayoutProps } from './types'
import {
	SidebarNavDataProvider,
	useSidebarNavData,
} from './contexts/sidebar-nav-data'
import { ScrollProgressBar } from './components/scroll-progress-bar'
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
	sidebarNavDataLevels,
	mainWidth = 'wide',
	versions,
}: SidebarSidecarLayoutProps) => {
	const { isMobileMenuRendered, mobileMenuIsOpen, setMobileMenuIsOpen } =
		useMobileMenu()
	const { currentLevel } = useSidebarNavData()
	const sidebarRef = useRef<HTMLDivElement>()
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })
	const currentlyViewedVersion = getVersionFromPath(currentPath)
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

	return (
		<div className={classNames(s.root, s[`mainWidth-${mainWidth}`])}>
			<MobileMenuContainer className={s.mobileMenuContainer} ref={sidebarRef}>
				<div className={s.sidebarContentWrapper}>
					<MobileAuthenticationControls />
					{sidebarContent}
				</div>
			</MobileMenuContainer>
			<div className={s.contentWrapper} ref={contentRef}>
				{currentlyViewedVersion && (
					<PageAlert
						className={s.versionAlert}
						description={
							<>
								You are viewing documentation for version{' '}
								{currentlyViewedVersion}.{' '}
								<InlineLink
									className={s.versionAlertLink}
									href={removeVersionFromPath(currentPath)}
									textSize={200}
									textWeight="medium"
								>
									View latest version
								</InlineLink>
								.
							</>
						}
						icon={<IconInfo16 />}
						type="highlight"
					/>
				)}
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
					<div className={s.sidecarWrapper}>{sidecarSlot}</div>
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
