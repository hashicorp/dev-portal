/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import type { GetStaticPropsContext } from 'next'
import DocsView from 'views/docs-view'
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'

const generated = getRootDocsPathGenerationFunctions('vault-radar', 'cloud')

const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const page = Array.isArray(ctx.params?.page) ? ctx.params.page : ['index']
	return generated.getStaticProps({
		...ctx,
		params: {
			...(ctx.params ?? {}),
			page,
		},
	})
}

const { getStaticPaths } = generated

export { getStaticPaths, getStaticProps }
export default DocsView
