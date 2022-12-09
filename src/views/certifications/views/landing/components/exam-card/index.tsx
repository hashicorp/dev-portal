import { ReactNode } from 'react'
import { StandaloneLinkContents } from 'views/certifications/components/standalone-link-contents'
import { ExamBadgeAndTitle } from '../'
import CardLink from 'components/card-link'
import useHover from 'hooks/use-hover'
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
	const [hoverRef, isHovered] = useHover<HTMLAnchorElement>()

	return (
		<CardLink className={s.examCard} href={url} ariaLabel="test" ref={hoverRef}>
			<ExamCardContents>
				<ExamBadgeAndTitle
					title={title}
					eyebrow="HashiCorp Certified:"
					productSlug={productSlug}
				/>
				<StandaloneLinkContents
					text="Prepare for the exam"
					isHovered={isHovered}
				/>
			</ExamCardContents>
		</CardLink>
	)
}

export { ExamCard, ExamCardComingSoon }
