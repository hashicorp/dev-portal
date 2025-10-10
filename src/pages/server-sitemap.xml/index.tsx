/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { allDocsFields, allTutorialsFields } from 'lib/sitemap'
import { unflatten } from 'flat'
import { loadHashiConfigForEnvironment } from '../../../config'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	try {
		const config = unflatten(await loadHashiConfigForEnvironment())

		// returns an array of docs content sitemap fields per slug
		const docsFields = await allDocsFields(config)
		// returns an array of tutorials content sitemap fields per slug
		const tutorialsFields = await allTutorialsFields(config)

		return getServerSideSitemap(ctx, [...docsFields, ...tutorialsFields])
	} catch (error) {
		throw new Error('Error generating server-sitemap.xml', error)
	}
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
