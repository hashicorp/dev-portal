/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import InlineLink from 'components/inline-link'
import DevDotContent from 'components/dev-dot-content'
import OutlineNav from 'components/outline-nav'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

import { HvdPage } from '../types'

export interface ValidatedDesignsGuideProps {
	title: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mdxSource: any // @TODO: fix type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers: any // @TODO: fix type
	currentPageIndex: number
	categorySlug: string
	basePath: string
	pages: HvdPage[]
}

export default function ValidatedDesignGuideView({
	title,
	mdxSource,
	headers,
	currentPageIndex,
	basePath,
	pages,
}: ValidatedDesignsGuideProps) {
	return (
		<SidebarSidecarLayout
			AlternateSidebar={() => (
				<>
					<InlineLink href={`${basePath}`}>
						Back to Validated Designs landing
					</InlineLink>
					{pages.map((page: HvdPage, index: number) => (
						<li key={page.slug}>
							<InlineLink href={page.href}>{page.title}</InlineLink>
							{index === currentPageIndex && <span> {'<- current'}</span>}
						</li>
					))}
				</>
			)}
			sidebarNavDataLevels={[]}
			// @TODO: move to using OutlineNavWithActiveLink
			sidecarSlot={<OutlineNav items={headers} />}
		>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<DevDotContent mdxRemoteProps={{ ...mdxSource }} />
		</SidebarSidecarLayout>
	)
}
