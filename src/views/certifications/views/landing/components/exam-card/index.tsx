import { ReactNode } from 'react'
import {
	CtaGroup,
	StandaloneLinkContents,
} from 'views/certifications/components'
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
 * Badge that says "Coming Soon", may be rendered in linked & unlinked cards.
 */
function ComingSoonBadge() {
	return <Badge text="Coming Soon" color="highlight" type="outlined" />
}

/**
 * Unlinked exam cards are used where a "prepareUrl" is not available yet.
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
				<ComingSoonBadge />
			</ExamCardContents>
		</Card>
	)
}

/**
 * Linked exam cards are used where a "prepareUrl" is available for the exam.
 *
 * If a "registerUrl" for the exam is not yet available, we show
 * a "Coming Soon" badge within this card as well.
 */
function ExamCard({ title, productSlug, url, showComingSoon }: ExamCardProps) {
	return (
		<CardLink className={s.examCard} href={url} ariaLabel="test">
			<ExamCardContents>
				<ExamBadgeAndTitle
					title={title}
					eyebrow="HashiCorp Certified:"
					productSlug={productSlug}
				/>
				<CtaGroup>
					{showComingSoon ? <ComingSoonBadge /> : null}
					<StandaloneLinkContents text="Prepare for the exam" />
				</CtaGroup>
			</ExamCardContents>
		</CardLink>
	)
}

export { ExamCard, ExamCardComingSoon }
