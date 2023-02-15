/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import fs from 'fs'
import path from 'path'
import { HomePageProps } from './types'
import {
	HomePageAuthoredContent,
	HomePageAuthoredContentSchema,
} from './content-schema'
import { validateAgainstSchema } from 'lib/validate-against-schema'
import { transformRawContent } from './helpers/transform-raw-content'

const generateStaticProps = async (
	contentJsonFile: string
): Promise<{ props: HomePageProps }> => {
	/**
	 * Note: could consider other content sources. For now, JSON.
	 * Asana task: https://app.asana.com/0/1100423001970639/1201631159784193/f
	 */
	const jsonFilePath = path.join(process.cwd(), contentJsonFile)
	const authoredContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

	/**
	 * Validate that authored content is in the expected format.
	 * This includes a type guard for content structure.
	 */
	validateAgainstSchema<HomePageAuthoredContent>(
		authoredContent,
		HomePageAuthoredContentSchema,
		'./src/pages/content.json'
	)

	/**
	 * Transform raw content into a content prop
	 */
	const content = await transformRawContent(authoredContent)

	return {
		props: { content },
	}
}

export { generateStaticProps }
