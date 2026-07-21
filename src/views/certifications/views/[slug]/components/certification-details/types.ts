export interface ExamDetail {
	name: string
	value: string
}

export interface CertificationDetailsProps {
	product: string
	data: {
		who: {
			title?: string
			desc: string
		}

		examDetails: {
			title?: string
			details: ExamDetail[]
		}

		prerequisites: {
			title?: string
			prereqs: string[]
			bottomDesc?: string
		}
	}
}
