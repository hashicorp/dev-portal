import ButtonLink from 'components/button-link'
import {
	CtaGroup,
	GradientCard,
	SplitCardSection,
} from 'views/certifications/components'
import { CertificationProgramSummary } from 'views/certifications/views/landing/types'
// Local
import { ExamCard, ExamCardUnlinked } from '..'
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
				startContent={
					<h3
						className={s.heading}
						dangerouslySetInnerHTML={{ __html: heading }}
					/>
				}
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
				{exams.map(
					({
						title,
						prepareUrl,
						registerUrl,
						examCode,
						examTier,
						productSlug,
					}) => {
						const fullTitle = title + (examCode ? ` (${examCode})` : '')
						const showComingSoon = typeof registerUrl !== 'string'
						return prepareUrl ? (
							<ExamCard
								key={fullTitle}
								title={fullTitle}
								url={prepareUrl}
								examTier={examTier}
								productSlug={productSlug}
								showComingSoon={showComingSoon}
							/>
						) : (
							<ExamCardUnlinked
								key={fullTitle}
								title={fullTitle}
								examTier={examTier}
								productSlug={productSlug}
							/>
						)
					}
				)}
			</div>
		</GradientCard>
	)
}
