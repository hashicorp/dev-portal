import BaseNewLayout from 'layouts/base-new'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	CertificationsHero,
	SignupFormArea,
} from 'views/certifications/components'
import { CertificationProgramSection } from './components'
import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image-outlined.svg'
import s from './landing.module.css'

function CertificationsLandingView({
	pageContent,
	programSummaries,
	faqItems,
}: CertificationLandingProps) {
	return (
		<>
			{/* TODO: split out hero to separate component folder, maybe? */}
			<CertificationsHero
				heading={pageContent.hero.heading}
				description={pageContent.hero.description}
				foreground="light"
				backgroundSlot={<div className={s.heroBackground} />}
				imageSlot={
					<div className={s.heroImage}>
						<Image alt="" src={svgHeroImage} width={447} height={515} />
					</div>
				}
			/>
			<div className={s.programsSection}>
				{programSummaries.map((programSummary: CertificationProgramSummary) => {
					const { slug, title, description, exams } = programSummary
					return (
						<CertificationProgramSection
							key={slug}
							slug={slug}
							heading={title}
							description={description}
							overviewCta={{
								text: 'Overview',
								url: `/certifications/${slug}`,
							}}
							exams={exams}
						/>
					)
				})}
			</div>
			<div className={s.faqSignupSection}>
				<CertificationsMaxWidth>
					<h2 className={s.faqHeading}>Program overview & FAQ</h2>
					<AccordionWithMdxContent
						items={faqItems}
						activatorHeadingLevel="h3"
					/>
					<div className={s.signupForm}>
						<SignupFormArea />
					</div>
				</CertificationsMaxWidth>
			</div>
		</>
	)
}

CertificationsLandingView.layout = BaseNewLayout
export default CertificationsLandingView
