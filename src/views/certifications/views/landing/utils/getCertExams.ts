/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// LOCAL PATHS
import { readLocalFilepaths } from 'lib/read-local-filepaths'
import { readLocalFile } from 'lib/read-local-file'
import path from 'path'

// TYPES
import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'

const EXAMS_DIR = 'src/content/certifications/exams'

/**  
    Grabs all file contents from `src/content/certifications/exams`, checks for duplicate exams, and returns the array if valid
	- Errors out if two or more exams have a duplicate ID
*/
export function getCertExams(): Exam[] {
	const examFiles = readLocalFilepaths(EXAMS_DIR)
	const certExams: Exam[] = []
	const seenExamIDs: Set<string> = new Set()

	for (const f of examFiles) {
		const examContent = readLocalFile(path.join(EXAMS_DIR, f))
		const parsedExams: Exam[] = JSON.parse(examContent)

		for (const e of parsedExams) {
			if (seenExamIDs.has(e.id)) {
				throw new Error(
					`Error: ${e.id} is a duplicate exam id. Please update ${e.title} and/or the conflicting exam(s) so that each exam has a unique id.`,
				)
			}

			certExams.push(e)
			seenExamIDs.add(e.id)
		}
	}

	return certExams
}
