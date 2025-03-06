/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductData } from 'types/products'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar/types'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import InstruqtProvider from 'contexts/instruqt-lab'
import EmbedElement from 'components/lab-embed/embed-element'

interface PlaygroundViewProps {
	product: ProductData
	labId: string
	layoutProps: {
		breadcrumbLinks: BreadcrumbLink[]
		navLevels: SidebarProps[]
	}
}

export default function PlaygroundView({
	product,
	labId,
	layoutProps,
}: PlaygroundViewProps) {
	return (
		<SidebarSidecarLayout
			breadcrumbLinks={layoutProps.breadcrumbLinks}
			sidebarNavDataLevels={layoutProps.navLevels}
		>
			<div style={{ height: '80vh' }}>
				<InstruqtProvider labId={labId} defaultActive isPlayground>
					<EmbedElement />
				</InstruqtProvider>
			</div>
		</SidebarSidecarLayout>
	)
}
