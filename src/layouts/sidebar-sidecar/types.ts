/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, ReactNode } from 'react'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'

export interface SidebarSidecarLayoutProps {
	breadcrumbLinks?: BreadcrumbLink[]
	children: ReactNode
	githubFileUrl?: string
	sidebarNavDataLevels: SidebarProps[]
	/** @TODO determine the minimum set of props that all Sidebars should have */
	AlternateSidebar?: (props: any) => ReactElement
	versions?: VersionSelectItem[]
	showScrollProgress?: boolean
	mainWidth?: 'wide' | 'narrow'
	sidecarSlot?: ReactNode
}
