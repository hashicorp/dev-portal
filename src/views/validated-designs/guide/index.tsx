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
import DirectionalLinkBox from 'views/tutorial-view/components/next-previous/components/directional-link-box'

import s from './detail-view.module.css'

export interface ValidatedDesignsGuideProps {
	title: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mdxSource: any // @TODO: fix type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers: any // @TODO: fix type
	currentPageIndex: number
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
	function renderPreviousLink() {
		if (currentPageIndex !== 0 && pages[currentPageIndex - 1]) {
			const page = pages[currentPageIndex - 1]

			return (
				<DirectionalLinkBox
					label="Previous"
					name={page.title}
					href={page.href}
					direction={'previous'}
					ariaLabel={`Go to previous page: ${page.title}`}
				/>
			)
		}
	}

	function renderNextLink() {
		if (currentPageIndex !== pages.length - 1 && pages[currentPageIndex + 1]) {
			const page = pages[currentPageIndex + 1]

			return (
				<DirectionalLinkBox
					label="Next"
					name={page.title}
					href={page.href}
					direction={'next'}
					ariaLabel={`Go to next page: ${page.title}`}
				/>
			)
		}
	}

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
			<div className={s.linkBoxWrapper}>
				{renderPreviousLink()}
				{renderNextLink()}
			</div>
		</SidebarSidecarLayout>
	)
}
