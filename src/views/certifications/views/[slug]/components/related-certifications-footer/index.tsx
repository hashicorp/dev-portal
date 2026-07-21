// Components
import Heading from '@components/heading'
import Text from '@components/text'
import { CertificationCardDisplay } from 'views/certifications/components/certification-card'

// Styles
import s from './related-certifications-footer.module.css'

// Types
import { CertificationCardProps } from 'views/certifications/components/certification-card/types'
import { CertificationsMaxWidth } from 'views/certifications/components'

interface relatedCertificationsFooterProps {
	title: string
	desc: string
	relatedCertifications: CertificationCardProps[]
}

export function RelatedCertificationsFooter({
	title,
	desc,
	relatedCertifications,
}: relatedCertificationsFooterProps) {
	return (
		<footer className={s.relatedCertFooter}>
			<CertificationsMaxWidth>
				<div className={s.relatedCertFooterContainer}>
					<div className={s.relatedCertFooterHeader}>
						<Heading
							level={2}
							size={600}
							weight={'bold'}
							className={s.relatedCertFooterTitle}
						>
							{title}
						</Heading>
						<Text size={300} className={s.relatedCertFooterDesc}>
							{desc}
						</Text>
					</div>
					<div className={s.relatedCertFooterContent}>
						{relatedCertifications &&
							relatedCertifications.map((certification, index) => (
								<CertificationCardDisplay
									key={`related-certification-${index}`}
									isReduced={true}
									product={certification.product}
									title={certification.title}
									ctaLink={certification.ctaLink}
								/>
							))}
					</div>
				</div>
			</CertificationsMaxWidth>
		</footer>
	)
}
