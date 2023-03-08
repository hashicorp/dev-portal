/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { allDocsUrls, allTutorialsUrls } from 'lib/sitemap'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	// returns an array of docs content sitemap objects per slug
	const docsUrlsPromise = allDocsUrls()
	// returns an array of tutorials content sitemap objects per slug
	const tutorialsUrlsPromise = allTutorialsUrls()
	const sitemapFields = await Promise.all([
		docsUrlsPromise,
		tutorialsUrlsPromise,
	]).catch((error: Error) => {
		throw new Error('Error generating server-sitemap.xml', error)
	})

	return getServerSideSitemap(ctx, sitemapFields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
