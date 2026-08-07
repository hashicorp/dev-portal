/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { findMatchingExams } from '../findMatchingExams'

// DUMMY DATA
const EXAM_A = {
	id: 'id-1',
	product: 'terraform',
	title: 'Exam A',
	ctaLink: '/certifications/terraform',
}

const EXAM_B = {
	id: 'id-2',
	product: 'vault',
	title: 'Exam B',
	ctaLink: '/certifications/vault',
}

const DESIRED_EXAM_1 = {
	id: 'id-1',
}

const DESIRED_EXAM_2 = {
	id: 'id-2',
}

const UNFOUND_EXAM = {
	id: 'id-3',
}

describe('findMatchingExams', () => {
	it('should throw an error from an empty desiredExams input', () => {
		const desiredExams = []
		const exams = [EXAM_A, EXAM_B]
		expect(() => findMatchingExams(desiredExams, exams)).toThrowError(
			'Error: Missing array of desired IDs. Please check to see if `certs` in `src/content/certifications/landing.json` or `src/content/certifications/examPages/[product-type].json` is empty.',
		)
	})

	it('should throw an error from an empty Exams input', () => {
		const desiredExams = [DESIRED_EXAM_1, DESIRED_EXAM_2]
		const exams = []
		expect(() => findMatchingExams(desiredExams, exams)).toThrowError(
			'Error: Missing array of exams. Please ensure that there are JSON files in `src/content/certifications/exams`, and that they have a `id` property.',
		)
	})

	it('should throw an error from a desired exam being not found', () => {
		const desiredExams = [DESIRED_EXAM_1, UNFOUND_EXAM]
		const exams = [EXAM_A, EXAM_B]

		expect(() => findMatchingExams(desiredExams, exams)).toThrowError(
			`Error: Exam ID ${UNFOUND_EXAM.id} was not found. Please ensure that the id is found in any of the exams within src/content/certifications/exams.`,
		)
	})

	it('should find all desired exams and return the proper exam objects', () => {
		const desiredExams = [DESIRED_EXAM_1, DESIRED_EXAM_2]
		const exams = [EXAM_A, EXAM_B]

		const examsByUUID = Object.fromEntries(exams.map((e) => [e.id, e]))

		const matchedExams = findMatchingExams(desiredExams, exams)

		expect(matchedExams).toHaveLength(desiredExams.length)
		for (const exam of matchedExams) {
			expect(exam).toHaveProperty('id')
			expect(exam).toHaveProperty('title')
			expect(exam).toHaveProperty('product')
			expect(exam).toHaveProperty('ctaLink')

			expect(exam).toEqual(examsByUUID[exam.id])
		}
	})
})
