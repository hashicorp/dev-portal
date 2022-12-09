import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { ExamBadge, ExamBadgeSlug } from 'views/certifications/components'
import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import s from './overview-card-badge-and-title.module.css'

function OverviewCardBadgeAndTitle({
	title,
	productSlug,
	versionTested,
}: {
	title: string
	productSlug: ExamBadgeSlug
	versionTested: string
}) {
	return (
		<div className={s.root}>
			<ExamBadge productSlug={productSlug} />
			<div className={s.eyebrow}>HashiCorp Certified:</div>
			<h2
				className={s.title}
				dangerouslySetInnerHTML={{ __html: mitigateWidows(title, 15) }}
			/>
			<div className={s.version}>
				<span className={s.versionIcon}>
					<IconInfo16 />
				</span>
				<span className={s.versionText}>
					<span className={s.versionLabel}>Product version tested:</span>
					<span className={s.versionValue}>{versionTested}</span>
				</span>
			</div>
		</div>
	)
}

export { OverviewCardBadgeAndTitle }
