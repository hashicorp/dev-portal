/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import {
	ExamPageMDXContent,
	CertificationProgram,
	ProgramSlug,
} from 'views/certifications/types'
import { RawCertificationProgram } from 'views/certifications/content/schemas/certification-program'
import { getFaqsFromMdx } from 'views/certifications/content/utils'
import { serialize } from 'lib/next-mdx-remote/serialize'

// Update DIRS to include objective dir/reuse exam faqs
const OBJECTIVES_DIR = 'src/content/certifications/objectives'
const RECERTIFICATIONS_DIR = 'src/content/certifications/recertifications'

/**
 * Process raw authored page content.
 *
 * Currently focused on transforming FAQ MDX slugs for each exam
 * into FAQ items, each with processed `mdxSource`.
 */
export async function preparePageContent(
	rawPageContent: RawCertificationProgram,
	slug: ProgramSlug,
): Promise<CertificationProgram> {
	// slug = terraform-associate
	const examPageMDXContent = await prepareExamContent(slug)

	return { ...rawPageContent, examPageMDXContent }
}

/**
 * Transforms an exam item with an `examSlug` into an exam item
 * with full `examPageMDXContent` data, ready to render in the view.
 */

async function prepareExamContent(
	examSlug: string,
): Promise<ExamPageMDXContent> {
	const examFile = `${examSlug}.mdx`
	const objectivesMdxString = readLocalFile(path.join(OBJECTIVES_DIR, examFile))
	const parsedObjectiveItems = await getFaqsFromMdx(objectivesMdxString)

	const recertificationsMdx = readLocalFile(
		path.join(RECERTIFICATIONS_DIR, examFile),
	)
	const recertMdxSource = await serialize(recertificationsMdx)

	return {
		objectivesItems: parsedObjectiveItems,
		recertificationMdx: recertMdxSource,
	}
}
