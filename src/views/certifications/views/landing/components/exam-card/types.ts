import { CertificationProductSlug } from 'views/certifications/types'

interface ExamCardBaseProps {
	title: string
	productSlug: CertificationProductSlug
}

export type ExamCardUnlinkedProps = ExamCardBaseProps
export interface ExamCardProps extends ExamCardBaseProps {
	url: string
	showComingSoon?: boolean
}
