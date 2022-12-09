import { CertificationProgram } from 'views/certifications/types'
import { CertificationsNavProps } from '../../components/certifications-nav/types'

export interface CertificationPageProps {
	slug: string
	navProps: CertificationsNavProps
	pageContent: CertificationProgram
}
