import { CertificationCardProps as Exam } from 'views/certifications/components/certification-card/types'

interface desiredExamProp {
	uuid?: string
}

/**
 *
 * @param desiredExams - Array of JSON objects with a uuid key and string value
 * @param exams - A list containing every exam from every product; Can be obtained from the flattenExams utility function
 * @returns
 */
export function findMatchingExam(
	desiredExams: desiredExamProp[],
	exams: Exam[],
): Exam[] {
	if (!desiredExams || !exams) {
		return []
	}

	const matchingExams = []
	for (const desiredExam of desiredExams) {
		for (const exam of exams) {
			if (exam.uuid === desiredExam.uuid) {
				matchingExams.push(exam)
				break
			}
		}
	}

	return matchingExams
}
