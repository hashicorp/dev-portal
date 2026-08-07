import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'

interface desiredExamProp {
	id?: string
}

/**
 *
 * @param desiredExams - Array of JSON objects with a id key and string value
 * @param exams - A list containing every exam from every product; Can be obtained from the getCertExams utility function
 * @returns List of matching exams
 *
 * Errors out if desiredExams/exams does not exist and if an exam could not be found.
 */
export function findMatchingExams(
	desiredExams: desiredExamProp[],
	exams: Exam[],
): Exam[] {
	if (desiredExams.length === 0) {
		throw new Error(
			'Error: Missing array of desired IDs. Please check to see if `certData` in `src/content/certifications/landing.json` or `src/content/certifications/examPages/[product-type].json` is empty.',
		)
	}

	if (exams.length === 0) {
		throw new Error(
			'Error: Missing array of exams. Please ensure that there are JSON files in `src/content/certifications/exams`, and that they have a `id` property.',
		)
	}

	const matchingExams: Exam[] = []
	let examFound: boolean = false
	for (const desiredExam of desiredExams) {
		for (const exam of exams) {
			if (exam.id === desiredExam.id) {
				matchingExams.push(exam)
				examFound = true
				break
			}
		}

		if (!examFound) {
			throw new Error(
				`Error: Exam ID ${desiredExam.id} was not found. Please ensure that the id is found in any of the exams within src/content/certifications/exams.`,
			)
		}
		examFound = false
	}

	return matchingExams
}
