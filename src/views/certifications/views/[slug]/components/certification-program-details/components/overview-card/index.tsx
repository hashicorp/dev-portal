import ButtonLink from 'components/button-link'
import { ButtonGroup, SplitCardSection } from '../../..'
import s from './overview-card.module.css'

export function OverviewCard({ title }: { title: string }) {
	return (
		<div className={s.root}>
			<SplitCardSection
				startContent={<h2 className={s.heading}>{title}</h2>}
				endContent={
					<div className={s.endContent}>
						<p className={s.description}>
							Brief intro- short but enough to help practitioners take that next
							step. Suggestion is a max of 3 lines of content. Verify your basic
							security automation skills. Prerequisites include; basic terminal
							skills, understanding of on premise or cloud architecture.
						</p>
						<div className={s.buttonGroup}>
							<ButtonGroup>
								<ButtonLink text="Prepare for the exam" href="/" />
								<ButtonLink
									text="Register for the exam"
									href="/"
									color="secondary"
								/>
							</ButtonGroup>
						</div>
					</div>
				}
			/>
		</div>
	)
}
