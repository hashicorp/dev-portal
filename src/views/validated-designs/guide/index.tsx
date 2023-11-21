/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import InlineLink from 'components/inline-link'

import { HvdPage } from '../types'

export interface ValidatedDesignsGuideProps {
	title: string
	filePath: string
	currentPageIndex: number
	categorySlug: string
	basePath: string
	pages: HvdPage[]
}

export default function ValidatedDesignGuideView({
	title,
	filePath,
	currentPageIndex,
	basePath,
	pages,
}: ValidatedDesignsGuideProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<h1>{title}</h1>
			<InlineLink href={`${basePath}`}>
				Back to Validated Designs landing
			</InlineLink>
			{pages.map((page: HvdPage, index: number) => (
				<li key={page.slug}>
					<InlineLink href={page.href}>{page.title}</InlineLink>
					{index === currentPageIndex && <span> {'<- current'}</span>}
				</li>
			))}
		</BaseLayout>
	)
}
