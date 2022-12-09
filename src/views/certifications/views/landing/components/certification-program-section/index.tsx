import ButtonLink from 'components/button-link'
import {
	ButtonGroup,
	CertificationsContentArea,
	GradientCard,
	SplitCardSection,
} from 'views/certifications/components'
import type { GradientCardTheme } from 'views/certifications/components'
// Local
import { ExamCard, ExamCardComingSoon } from '../'
// Styles
import s from './certification-program-section.module.css'

interface CertificationItem {
	title: string
	productSlug: 'consul' | 'terraform' | 'vault'
	url?: string
}

interface CertificationProgramSectionProps {
	slug: string
	heading: string
	description: string
	overviewCta: {
		text: string
		url: string
	}
	certifications: CertificationItem[]
}

export function CertificationProgramSection({
	slug,
	heading,
	description,
	overviewCta,
	certifications,
}: CertificationProgramSectionProps) {
	return (
		<>
			<CertificationsContentArea>
				<GradientCard theme={slug as GradientCardTheme}>
					<SplitCardSection
						className={s.splitSection}
						startContent={<h3 className={s.heading}>{heading}</h3>}
						endContent={
							<>
								<div className={s.description}>{description}</div>
								<ButtonGroup className={s.buttonGroup}>
									<ButtonLink text={overviewCta.text} href={overviewCta.url} />
								</ButtonGroup>
							</>
						}
					/>
					<div className={s.examCards}>
						{certifications.map(
							({ title, url, productSlug }: CertificationItem) => {
								return url ? (
									<ExamCard
										key={title}
										title={title}
										url={url}
										productSlug={productSlug}
									/>
								) : (
									<ExamCardComingSoon
										key={title}
										title={title}
										productSlug={productSlug}
									/>
								)
							}
						)}
					</div>
				</GradientCard>
			</CertificationsContentArea>
		</>
	)
}
