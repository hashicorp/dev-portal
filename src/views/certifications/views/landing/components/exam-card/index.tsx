import { ReactNode } from 'react'
import { StandaloneLinkContents } from 'views/certifications/components'
import { ExamBadgeAndTitle } from '../'
import CardLink from 'components/card-link'
import s from './exam-card.module.css'
import Card from 'components/card'
import Badge from 'components/badge'

function ExamCardContents({ children }: { children: ReactNode }) {
	return <div className={s.contents}>{children}</div>
}

function ExamCardComingSoon({ title, productSlug }) {
	return (
		<Card className={s.comingSoonCard}>
			<ExamCardContents>
				<ExamBadgeAndTitle
					title={title}
					eyebrow="HashiCorp Certified:"
					productSlug={productSlug}
				/>
				<Badge text="Coming Soon" color="highlight" type="outlined" />
			</ExamCardContents>
		</Card>
	)
}

function ExamCard({ title, url, productSlug }) {
	return (
		<CardLink className={s.examCard} href={url} ariaLabel="test">
			<ExamCardContents>
				<ExamBadgeAndTitle
					title={title}
					eyebrow="HashiCorp Certified:"
					productSlug={productSlug}
				/>
				<StandaloneLinkContents text="Prepare for the exam" />
			</ExamCardContents>
		</CardLink>
	)
}

export { ExamCard, ExamCardComingSoon }
