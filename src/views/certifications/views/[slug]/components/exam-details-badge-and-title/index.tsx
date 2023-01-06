import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
import { CertificationProductSlug, ExamTier } from 'views/certifications/types'
import { ExamBadge } from 'views/certifications/components'
import s from './exam-details-badge-and-title.module.css'

/**
 * Renders title text paired with a certifications badge and a string
 * representing the details of a specific exam.
 */
function ExamDetailsBadgeAndTitle({
	title,
	productSlug,
	versionTested,
	examTier,
}: {
	title: string
	productSlug: CertificationProductSlug
	versionTested: string
	examTier: ExamTier
}) {
	return (
		<div className={s.root}>
			<ExamBadge productSlug={productSlug} examTier={examTier} />
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

export { ExamDetailsBadgeAndTitle }
