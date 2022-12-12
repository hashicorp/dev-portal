/**
 * TODO: maybe flatten components nested here to [slug]/components?
 */
import { OverviewCard } from './components'
import {
	AccordionWithMdxContent,
	AccordionMdxItem,
	CertificationsMaxWidth,
	ExamBadgeSlug,
	GradientCardTheme,
} from 'views/certifications/components'
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
	faqItems: AccordionMdxItem[]
	productSlug: ExamBadgeSlug
	versionTested: string
	slug: GradientCardTheme
	links?: {
		prepare?: string
		register?: string
	}
}) {
	return (
		<CertificationsMaxWidth>
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
			<AccordionWithMdxContent items={faqItems} activatorHeadingLevel="h3" />
		</CertificationsMaxWidth>
	)
}
