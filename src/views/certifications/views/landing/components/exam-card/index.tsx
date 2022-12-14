import { ReactNode } from 'react'
import { StandaloneLinkContents } from 'views/certifications/components'
import { ExamBadgeAndTitle } from '../'
import CardLink from 'components/card-link'
import s from './exam-card.module.css'
import Card from 'components/card'
import Badge from 'components/badge'
import { ExamCardComingSoonProps, ExamCardProps } from './types'

/**
 * Flex layout wrapper for the contents of an exam card.
 */
function ExamCardContents({ children }: { children: ReactNode }) {
	return <div className={s.contents}>{children}</div>
}

/**
 * "Coming Soon" exam cards are not linked.
 */
function ExamCardComingSoon({ title, productSlug }: ExamCardComingSoonProps) {
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

function ExamCard({ title, productSlug, url }: ExamCardProps) {
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
