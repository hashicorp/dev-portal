/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'

import DevDotContent from 'components/dev-dot-content'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'

import { OutlineNavWithActive } from 'components/outline-nav/components'
import DirectionalLinkBox from 'components/directional-link-box'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	SidebarHorizontalRule,
	SidebarNavHighlightItem,
	SidebarSectionBrandedHeading,
} from 'components/sidebar/components'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'

import s from './detail-view.module.css'

import type { HvdPage } from '../types'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type { OutlineLinkItem } from 'components/outline-nav/types'

export interface ValidatedDesignsGuideProps {
	title: string
	markdown: {
		mdxSource: MDXRemoteSerializeResult
		title: string
		description: string
	}
	headers: OutlineLinkItem[]
	currentPageIndex: number
	basePath: string
	pages: HvdPage[]
}

export default function ValidatedDesignGuideView({
	title,
	markdown,
	headers,
	currentPageIndex,
	basePath,
	pages,
}: ValidatedDesignsGuideProps) {
	const docsMdxComponents = getDocsMdxComponents('hcp')
	const backBtnTitle = 'HVD Home'
	const backBtnUrl = basePath

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
			sidebarNavDataLevels={[
				{
					backToLinkProps: {
						text: backBtnTitle,
						href: backBtnUrl,
					},
					title,
					visuallyHideTitle: true,
					showFilterInput: false,
					showResourcesList: false,
					children: (
						<>
							<SidebarSectionBrandedHeading text={title} theme={'hcp'} />
							<SidebarHorizontalRule />
							<SidebarNavList>
								{pages.map((page: HvdPage, index: number) => {
									return (
										<SidebarNavHighlightItem
											key={page.slug}
											text={page.title}
											theme={'generic'}
											href={page.href}
											isActive={index === currentPageIndex}
										/>
									)
								})}
							</SidebarNavList>
						</>
					),
				},
			]}
			sidecarSlot={<OutlineNavWithActive items={headers} />}
		>
			<Head>
				<title>{markdown.title}</title>
				<meta name="robots" content="noindex, nofollow" />
				<meta name="description" content={markdown.description} />
			</Head>
			<div className={s.mobileBackButton}>
				<SidebarBackToLink text={backBtnTitle} href={backBtnUrl} />
			</div>
			<DevDotContent
				mdxRemoteProps={{
					...markdown.mdxSource,
					components: {
						...docsMdxComponents,
					},
				}}
			/>
			<div className={s.linkBoxWrapper}>
				{renderPreviousLink()}
				{renderNextLink()}
			</div>
		</SidebarSidecarLayout>
	)
}
