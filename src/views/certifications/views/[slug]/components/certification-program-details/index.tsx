/**
 * TODO: maybe flatten components nested here to [slug]/components?
 */
import { OverviewCard } from './components'
import {
	AccordionWithMdxContent,
	CertificationsContentArea,
	ExamBadgeSlug,
	GradientCardTheme,
} from 'views/certifications/components'
import { FaqItem } from 'views/certifications/types'
import s from './certification-program-details.module.css'

export function CertificationProgramDetails({
	title,
	description,
	faqItems,
	links,
	productSlug,
	versionTested,
	slug,
}: {
	title: string
	description: string
	faqItems: FaqItem[]
	productSlug: ExamBadgeSlug
	versionTested: string
	slug: GradientCardTheme
	links?: {
		prepare?: string
		register?: string
	}
}) {
	return (
		<>
			<div className={s.root}>
				<CertificationsContentArea>
					<div className={s.overviewCard}>
						<OverviewCard
							title={title}
							description={description}
							links={links}
							productSlug={productSlug}
							versionTested={versionTested}
							slug={slug}
						/>
					</div>
					<h2 className={s.accordionHeading}>Overview</h2>
					<AccordionWithMdxContent
						items={faqItems}
						activatorHeadingLevel="h3"
					/>
				</CertificationsContentArea>
			</div>
		</>
	)
}
