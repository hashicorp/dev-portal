/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

export interface ExamDetail {
	name: string
	value: string
}

export interface CertificationDetailsProps {
	product: string
	data: {
		whoShouldTakeExam: {
			title?: string
			description: string
		}

		examDetails: {
			title?: string
			details: ExamDetail[]
		}

		prerequisites: {
			title?: string
			prereqs: string[]
			bottomDescription?: string
		}
	}
}
