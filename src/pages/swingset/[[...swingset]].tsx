/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState } from 'react'
import createPage from 'swingset/page'
import { createStaticProps, createStaticPaths } from 'swingset/server'
import remarkGfm from 'remark-gfm'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import { SidebarNavDataProvider } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'

// additional components
import Search from '@hashicorp/react-search'
import { SearchProvider } from '@hashicorp/react-search'
import InstruqtProvider from 'contexts/instruqt-lab'
import TabProvider from 'components/tabs/provider'
import SwingsetColorToken from '__swingset-components/swingset-color-token'
import SwingsetTestIcon from '__swingset-components/swingset-test-icon'
import { useDeviceSize } from 'contexts/device-size'

const components = {
	useDeviceSize,
	useState,
	InstruqtProvider,
	Search,
	SearchProvider,
	TabProvider,
	SwingsetColorToken,
	SwingsetTestIcon,
}

const SwingsetPage = createPage({ components })

const SwingsetLayout = ({ children }) => {
	return (
		// SidebarNavDataProvider is needed for the Sidebar docs to work
		<CoreDevDotLayout>
			<SidebarNavDataProvider navDataLevels={[]}>
				{children}
			</SidebarNavDataProvider>
		</CoreDevDotLayout>
	)
}

// @ts-expect-error - .layout is a custom concept for our application
SwingsetPage.layout = SwingsetLayout

export const getStaticPaths = createStaticPaths()
export const getStaticProps = createStaticProps({
	mdxOptions: { remarkPlugins: [remarkGfm] },
})
export default SwingsetPage
