import ButtonLink from 'components/button-link'
import Badge from 'components/badge'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
// Shared certifications
import {
	CtaGroup,
	SplitCardSection,
	GradientCard,
} from 'views/certifications/components'
import {
	CertificationProductSlug,
	ProgramSlug,
} from 'views/certifications/types'
// Local
import { ExamDetailsBadgeAndTitle } from '../'
import s from './exam-details-card.module.css'

/**
 * Renders a card that displays details for a certifications exam
 * within a particular certifications program
 */
export function ExamDetailsCard({
	title,
	description,
	links,
	productSlug,
	versionTested,
	slug,
}: {
	title: string
	description: string
	productSlug: CertificationProductSlug
	versionTested: string
	slug: ProgramSlug
	links?: {
		prepare?: string
		register?: string
	}
}) {
	const hasLinks = links?.prepare || links?.register

	return (
		<GradientCard theme={slug}>
			<SplitCardSection
				className={s.splitCardSection}
				startContent={
					<ExamDetailsBadgeAndTitle
						title={title}
						productSlug={productSlug}
						versionTested={versionTested}
					/>
				}
				endContent={
					<>
						<p className={s.description}>{description}</p>
						<div className={s.ctaGroup}>
							{hasLinks ? (
								<CtaGroup>
									{links.prepare ? (
										<ButtonLink
											text="Prepare for the exam"
											href={links.prepare}
										/>
									) : null}
									{links.register ? (
										<StandaloneLink
											text="Register for the exam"
											href={links.register}
											color="secondary"
											icon={<IconArrowRight16 />}
											iconPosition="trailing"
										/>
									) : null}
								</CtaGroup>
							) : (
								<Badge text="Coming Soon" color="highlight" type="outlined" />
							)}
						</div>
					</>
				}
			/>
		</GradientCard>
	)
}
