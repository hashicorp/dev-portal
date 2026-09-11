/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// COMPONENTS
import { getCertExams } from '../getCertExams'

// MOCKS
vi.mock('lib/read-local-filepaths')
vi.mock('lib/read-local-file')

import { readLocalFilepaths } from 'lib/read-local-filepaths'
import { readLocalFile } from 'lib/read-local-file'

// DUMMY DATA
const EXAM_A = JSON.stringify([{ id: 'id-1', title: 'Exam A' }])
const EXAM_B = JSON.stringify([{ id: 'id-2', title: 'Exam B' }])
const EXAM_DUPE = JSON.stringify([{ id: 'id-1', title: 'Exam C' }])
const EXAM_MULTI_TYPE = JSON.stringify([
	{ id: 'id-3', title: 'Exam E' },
	{ id: 'id-4', title: 'Exam F' },
])

const EXAM_DUPE_WITHIN = JSON.stringify([
	{ id: 'id-5', title: 'Exam G' },
	{ id: 'id-5', title: 'Exam H' },
])

describe('getCertExams', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should throw an error from a duplicate exam id across files', () => {
		vi.mocked(readLocalFilepaths).mockReturnValue([
			'exam-a.json',
			'exam-dupe.json',
		])
		vi.mocked(readLocalFile)
			.mockReturnValueOnce(EXAM_A)
			.mockReturnValueOnce(EXAM_DUPE)

		expect(() => getCertExams()).toThrow('id-1')
	})

	it('should throw an error for a duplicate id within a single file', () => {
		vi.mocked(readLocalFilepaths).mockReturnValue(['exam-dupe-within.json'])
		vi.mocked(readLocalFile).mockReturnValueOnce(EXAM_DUPE_WITHIN)

		expect(() => getCertExams()).toThrow('id-5')
	})

	it('should return a nonempty array of exams', () => {
		vi.mocked(readLocalFilepaths).mockReturnValue([
			'exam-a.json',
			'exam-b.json',
		])
		vi.mocked(readLocalFile)
			.mockReturnValueOnce(EXAM_A)
			.mockReturnValueOnce(EXAM_B)

		const exams = getCertExams()

		expect(exams).toBeInstanceOf(Array)
		expect(exams).toHaveLength(2)
	})

	it('should condense exams from multiple types within one file to a single array', () => {
		vi.mocked(readLocalFilepaths).mockReturnValue(['exam-multi.json'])
		vi.mocked(readLocalFile).mockReturnValueOnce(EXAM_MULTI_TYPE)

		const exams = getCertExams()

		expect(exams).toHaveLength(2)
		expect(exams.map((e) => e.id)).toEqual(['id-3', 'id-4'])
	})

	it('should return an empty array of Exams', () => {
		vi.mocked(readLocalFilepaths).mockReturnValue([])
		vi.mocked(readLocalFile).mockReturnValueOnce('')

		const exams = getCertExams()

		expect(exams).toBeInstanceOf(Array)
		expect(exams).toHaveLength(0)
	})
})
