import ButtonLink from 'components/button-link'
import Badge from 'components/badge'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import {
	ButtonGroup,
	SplitCardSection,
	GradientCard,
	ExamBadgeSlug,
	GradientCardTheme,
} from 'views/certifications/components'
import { OverviewCardBadgeAndTitle } from '../overview-card-badge-and-title'
import s from './overview-card.module.css'

export function OverviewCard({
	title,
	description,
	links,
	productSlug,
	versionTested,
	slug,
}: {
	title: string
	description: string
	productSlug: ExamBadgeSlug
	versionTested: string
	slug: GradientCardTheme
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
					<OverviewCardBadgeAndTitle
						title={title}
						productSlug={productSlug}
						versionTested={versionTested}
					/>
				}
				endContent={
					<>
						<p className={s.description}>{description}</p>
						<div className={s.buttonGroup}>
							{hasLinks ? (
								<ButtonGroup>
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
								</ButtonGroup>
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
