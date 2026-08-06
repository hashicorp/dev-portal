import { readLocalFilepaths } from 'lib/read-local-filepaths'
import { readLocalFile } from 'lib/read-local-file'
import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'
import path from 'path'

const EXAMS_DIR = 'src/content/certifications/exams'

/**  
    - Grab all file contents from src/content/certifications/exams
    - Flatten each exam type into a singular array of JSON objects
    - Return the singular array
*/
export function flattenExams(): Exam[] {
	const examFiles = readLocalFilepaths(EXAMS_DIR)
	const flattenedExams: Exam[] = []

	for (const f of examFiles) {
		const examContent = readLocalFile(path.join(EXAMS_DIR, f))
		const parsedExam: JSON = JSON.parse(examContent)

		flattenedExams.push(...extractExamsFromType(parsedExam))
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
