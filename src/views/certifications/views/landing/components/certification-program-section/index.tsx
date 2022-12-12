import ButtonLink from 'components/button-link'
import {
	ButtonGroup,
	CertificationsMaxWidth,
	GradientCard,
	SplitCardSection,
} from 'views/certifications/components'
import type { GradientCardTheme } from 'views/certifications/components'
// Local
import { ExamCard, ExamCardComingSoon } from '../'
// Styles
import s from './certification-program-section.module.css'

/**
 * TODO: some of these types should probably be shared.
 * (eg supported product slugs from badge, maybe?)
 */
interface CertificationExam {
	title: string
	productSlug: 'consul' | 'terraform' | 'vault'
	url?: string
}

/**
 * TODO: split to separate types file
 */
interface CertificationProgramSectionProps {
	slug: string
	heading: string
	description: string
	overviewCta: {
		text: string
		url: string
	}
	exams: CertificationExam[]
}

export function CertificationProgramSection({
	slug,
	heading,
	description,
	overviewCta,
	exams,
}: CertificationProgramSectionProps) {
	return (
		<>
			<CertificationsMaxWidth>
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
						{exams.map(({ title, url, productSlug }: CertificationExam) => {
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
						})}
					</div>
				</GradientCard>
			</CertificationsMaxWidth>
		</>
	)
}
