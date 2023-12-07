/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import InlineLink from 'components/inline-link'
import DevDotContent from 'components/dev-dot-content'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

import { HvdPage } from '../types'
import DirectionalLinkBox from 'views/tutorial-view/components/next-previous/components/directional-link-box'

import s from './detail-view.module.css'

import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { OutlineLinkItem } from 'components/outline-nav/types'

export interface ValidatedDesignsGuideProps {
	title: string
	mdxSource: MDXRemoteSerializeResult
	headers: OutlineLinkItem[]
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
			sidecarSlot={<OutlineNavWithActive items={headers} />}
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
