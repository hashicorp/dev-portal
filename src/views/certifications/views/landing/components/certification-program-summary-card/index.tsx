import ButtonLink from 'components/button-link'
import {
	CtaGroup,
	GradientCard,
	SplitCardSection,
} from 'views/certifications/components'
import { CertificationProgramSummary } from 'views/certifications/views/landing/types'
// Local
import { ExamCard, ExamCardComingSoon } from '..'
// Styles
import s from './certification-program-summary-card.module.css'

export function CertificationProgramSummaryCard({
	slug,
	heading,
	description,
	exams,
}: CertificationProgramSummary) {
	return (
		<GradientCard theme={slug}>
			<SplitCardSection
				className={s.splitSection}
				startContent={<h3 className={s.heading}>{heading}</h3>}
				endContent={
					<>
						<div className={s.description}>{description}</div>
						<CtaGroup className={s.buttonGroup}>
							<ButtonLink text="Overview" href={`/certifications/${slug}`} />
						</CtaGroup>
					</>
				}
			/>
			<div className={s.examCards}>
				{exams.map(({ title, prepareUrl, productSlug }) => {
					return prepareUrl ? (
						<ExamCard
							key={title}
							title={title}
							url={prepareUrl}
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
	)
}
