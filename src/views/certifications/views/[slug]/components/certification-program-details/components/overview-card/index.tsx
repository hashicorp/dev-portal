import ButtonLink from 'components/button-link'
import { ButtonGroup, SplitCardSection } from '../../..'
import s from './overview-card.module.css'

export function OverviewCard({
	title,
	description,
	links,
}: {
	title: string
	description: string
	links?: {
		prepare?: string
		register?: string
	}
}) {
	const hasLinks = links?.prepare || links?.register

	return (
		<div className={s.root}>
			<SplitCardSection
				startContent={<h2 className={s.heading}>{title}</h2>}
				endContent={
					<div className={s.endContent}>
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
										<ButtonLink
											text="Register for the exam"
											href={links.register}
											color="secondary"
										/>
									) : null}
								</ButtonGroup>
							) : (
								<span
									style={{
										display: 'inline-block',
										color: 'purple',
										padding: '0.5rem 1rem',
										border: '1px solid purple',
										borderRadius: '4px',
									}}
								>
									Coming soon
								</span>
							)}
						</div>
					</div>
				}
			/>
		</div>
	)
}
