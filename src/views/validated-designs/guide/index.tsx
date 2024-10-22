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
	SidebarSectionBrandedHeading,
	SidebarNavMenuItem,
	SidebarNavLinkItem,
} from 'components/sidebar/components'
import SidebarNavList from 'components/sidebar/components/sidebar-nav-list'
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'

import s from './detail-view.module.css'

import type { HvdPage, HvdPageMenuItem } from '../types'
import type { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import type { OutlineLinkItem } from 'components/outline-nav/types'
import { ProductSlug } from 'types/products'

// Keep in sync HVD PDF location
const PDF_BASE_URL = 'https://d2cn2jw7bw0rn4.cloudfront.net'
const downloadFileTitle = (guideTitle) =>
	`${guideTitle.replaceAll(/[\[{}():,\]]/g, '').replaceAll(' ', '-')}.pdf`

export interface ValidatedDesignsGuideProps {
	metadata: {
		title: string
		description: string
	}
	guideTitle: string
	productSlug: Exclude<ProductSlug, 'sentinel'>
	markdown: {
		mdxSource: MDXRemoteSerializeResult
	}
	headers: OutlineLinkItem[]
	currentPageIndex: number
	basePath: string
	pages: HvdPage[]
}

export default function ValidatedDesignGuideView({
	metadata,
	guideTitle,
	productSlug,
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
		const prevPage = pages[currentPageIndex - 1]

		if (currentPageIndex !== 0 && prevPage) {
			return (
				<DirectionalLinkBox
					id={prevPage.href}
					label="Previous"
					name={prevPage.title}
					href={prevPage.href}
					direction={'previous'}
					ariaLabel={`Go to previous page: ${prevPage.title}`}
				/>
			)
		} else {
			// We add this empty div here so that even when only one "paging buttons" is rendered, they always only take up 50%
			return <div className={s.hideOnMobile} />
		}
	}

	function renderNextLink() {
		const nextPage = pages[currentPageIndex + 1]

		if (currentPageIndex !== pages.length - 1 && nextPage) {
			return (
				<DirectionalLinkBox
					id={nextPage.href}
					label="Next"
					name={nextPage.title}
					href={nextPage.href}
					direction={'next'}
					ariaLabel={`Go to next page: ${nextPage.title}`}
				/>
			)
		} else {
			// We add this empty div here so that even when only one "paging buttons" is rendered, they always only take up 50%
			return <div className={s.hideOnMobile} />
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
					title: guideTitle,
					visuallyHideTitle: true,
					showFilterInput: false,
					showResourcesList: false,
					children: (
						<>
							<SidebarSectionBrandedHeading
								text={guideTitle}
								theme={productSlug}
							/>
							<SidebarHorizontalRule />
							<SidebarNavList>
								{pages.map((page: HvdPageMenuItem, index: number) => (
									<SidebarNavMenuItem
										key={page.slug}
										item={{
											...page,
											isActive: index === currentPageIndex,
										}}
									/>
								))}
							</SidebarNavList>
							<SidebarHorizontalRule />
							<SidebarNavLinkItem
								item={{
									href: `${PDF_BASE_URL}/${downloadFileTitle(guideTitle)}`,
									title: 'Download as PDF',
								}}
							/>
							{process.env.NODE_ENV === 'development' && (
								<SidebarNavLinkItem
									item={{
										title:
											'Download as PDF only downloads the most recent PDF generated on the main branch, it will not update the PDF for PR branches.',
									}}
								/>
							)}
						</>
					),
				},
			]}
			sidecarSlot={<OutlineNavWithActive items={headers} />}
		>
			<Head>
				<meta name="robots" content="noindex, nofollow" key="robots" />
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
