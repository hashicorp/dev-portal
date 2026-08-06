import { readLocalFilepaths } from 'lib/read-local-filepaths'
import { readLocalFile } from 'lib/read-local-file'
import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'
import path from 'path'

const EXAMS_DIR = 'src/content/certifications/exams'

/**  
    Grabs all file contents from `src/content/certifications/exams`, turns each exam type into a singular array of JSON objects, and returns the array
	- Errors out if two or more exams have a duplicate UUID
*/
export function getCertExams(): Exam[] {
	const examFiles = readLocalFilepaths(EXAMS_DIR)
	const flattenedExams: Exam[] = []
	const seenExamUUIDs: Set<string> = new Set()

	for (const f of examFiles) {
		const examContent = readLocalFile(path.join(EXAMS_DIR, f))
		const parsedExam: JSON = JSON.parse(examContent)
		const extractedExams = extractExamsFromType(parsedExam)

		for (const e of extractedExams) {
			if (seenExamUUIDs.has(e.uuid)) {
				console.log("DUPE!!!")
				throw new Error(
					`Error: ${e.uuid} is a duplicate exam uid. Please update ${e.title} and/or the conflicting exam(s) so that each exam has a unique uid.`,
				)
			}

			flattenedExams.push(e)
			seenExamUUIDs.add(e.uuid)
		}
	}

	return flattenedExams
}
/**
 *
 * @param examJSON - JSON object with keys being exam types and values being an array of exam objects
 * @returns A singular array with every exam object from every exam type
 */
function extractExamsFromType(examJSON: JSON): Exam[] {
	const allExams = []
	for (const examType in examJSON) {
		const exams = examJSON[examType]
		allExams.push(...exams)
	}

	return allExams
}
