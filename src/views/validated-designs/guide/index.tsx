/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import DevDotContent from 'components/dev-dot-content'
import { OutlineNavWithActive } from 'components/outline-nav/components'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'

import { HvdPage } from '../types'
import DirectionalLinkBox from 'components/directional-link-box'

import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { OutlineLinkItem } from 'components/outline-nav/types'
import {
	SidebarNavHighlightItem,
	SidebarSectionBrandedHeading,
} from 'components/sidebar/components'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'

import s from './detail-view.module.css'
import getDocsMdxComponents from 'views/docs-view/utils/get-docs-mdx-components'

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
						text: `HVD Home`,
						href: `${basePath}`,
					},
					title,
					visuallyHideTitle: true,
					showFilterInput: false,
					showResourcesList: false,
					children: (
						<>
							<SidebarSectionBrandedHeading text={title} theme={'hcp'} />
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
