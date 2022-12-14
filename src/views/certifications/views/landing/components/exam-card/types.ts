import { CertificationProductSlug } from 'views/certifications/types'

export interface ExamCardComingSoonProps {
	title: string
	productSlug: CertificationProductSlug
}

export interface ExamCardProps extends ExamCardComingSoonProps {
	url: string
}
