import { CertificationProductSlug } from 'views/certifications/types'
import { ExamBadge } from 'views/certifications/components'
import s from './exam-badge-and-title.module.css'

function ExamBadgeAndTitle({
	title,
	eyebrow,
	productSlug,
}: {
	title: string
	eyebrow: string
	productSlug: CertificationProductSlug
}) {
	return (
		<div className={s.root}>
			<ExamBadge productSlug={productSlug} />
			<div className={s.text}>
				<div className={s.eyebrow}>{eyebrow}</div>
				<div className={s.title}>{title}</div>
			</div>
		</div>
	)
}

export { ExamBadgeAndTitle }
