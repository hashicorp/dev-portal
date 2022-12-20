import { CertificationProductSlug, ExamTier } from 'views/certifications/types'

interface ExamCardBaseProps {
	title: string
	productSlug: CertificationProductSlug
	examTier: ExamTier
}

export type ExamCardUnlinkedProps = ExamCardBaseProps
export interface ExamCardProps extends ExamCardBaseProps {
	url: string
	showComingSoon?: boolean
}
