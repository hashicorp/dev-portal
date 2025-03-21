/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, ReactNode } from 'react'
import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'

export interface SidebarSidecarLayoutProps {
	breadcrumbLinks?: BreadcrumbLink[]
	children: ReactNode
	githubFileUrl?: string
	sidebarNavDataLevels: SidebarProps[]
	/** @TODO determine the minimum set of props that all Sidebars should have */
	AlternateSidebar?: (props: $TSFixMe) => ReactElement
	versions?: VersionSelectItem[]
	showScrollProgress?: boolean
	mainWidth?: 'wide' | 'narrow'
	/**
	 * Optionally render content into the sidecar area.
	 * If omitted, blank space will be shown in the sidecar area.
	 */
	sidecarSlot?: ReactNode
	/**
	 * Optionally render content above the scrollable sidecar area.
	 * If omitted, blank space will be shown above the scrollable sidecar area.
	 */
	sidecarTopSlot?: ReactNode
	/**
	 * Optionally render an alert banner before the main content area.
	 */
	alertBannerSlot?: ReactNode
}
