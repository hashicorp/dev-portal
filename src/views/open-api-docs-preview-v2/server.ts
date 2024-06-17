/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import { readProps, TMP_PROPS_FILE } from 'pages/api/open-api-preview-v2'
// Types
import type { GetServerSidePropsResult } from 'next'

const IS_PRODUCTION = process.env.HASHI_ENV === 'production'

/**
 * TODO: add description
 */
export async function getServerSideProps(): Promise<
	GetServerSidePropsResult<$TSFixMe>
> {
	// In production, return a 404 not found for this page.
	if (IS_PRODUCTION) {
		return { notFound: true }
	}
	// Attempt to read in a local props file
	const rawStaticProps = readProps(TMP_PROPS_FILE)
	const staticProps = rawStaticProps ? rawStaticProps.props : null
	// In other environments (local, preview, and staging), show the page.
	// Note that `staticProps` may be `null`, if the user has not yet provided
	// an OpenAPI spec file to preview
	return { props: { staticProps } }
}
