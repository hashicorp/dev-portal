import { GradientCardTheme } from 'views/certifications/components'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationsNavProps } from '../../components/certifications-nav/types'

export interface CertificationPageProps {
	slug: GradientCardTheme
	navProps: CertificationsNavProps
	pageContent: CertificationProgram
}
