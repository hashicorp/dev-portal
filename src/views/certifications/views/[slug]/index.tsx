import classNames from 'classnames'
// Global
import BaseNewLayout from 'layouts/base-new'
// Shared view components
import {
	AccordionWithMdxContent,
	CertificationsContentArea,
	CertificationsNav,
	CertificationsHero,
	GradientCardTheme,
	SignupFormArea,
} from 'views/certifications/components'
// Local view components
// import { CertificationProgramDetails } from './components'
import { OverviewCard } from './components/certification-program-details/components'
import { CertificationPageProps } from './types'
// Styles
import s from './program-view.module.css'
import { Fragment } from 'react'

function CertificationPage({
	navProps,
	pageContent,
	slug,
}: CertificationPageProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsHero
				heading={pageContent.hero.heading}
				description={pageContent.hero.description}
				foreground={slug === 'security-automation' ? 'dark' : 'light'}
				backgroundSlot={
					<div className={classNames(s.heroBackground, s[`theme-${slug}`])} />
				}
			/>
			<div className={s.mainSection}>
				<CertificationsContentArea key={slug}>
					<div className={s.certificationsSection}>
						{pageContent.certifications.map((certification) => {
							return (
								<div key={slug}>
									<OverviewCard
										title={certification.title}
										description={certification.description}
										links={certification.links}
										productSlug={certification.productSlug}
										versionTested={certification.versionTested}
										slug={slug as GradientCardTheme}
									/>
									<h2 className={s.certificationAccordionHeading}>Overview</h2>
									<AccordionWithMdxContent
										items={certification.faqItems.map((item) => {
											return {
												title: item.title,
												mdxSource: item.mdxSource,
											}
										})}
										activatorHeadingLevel="h3"
									/>
								</div>
							)
						})}
					</div>
				</CertificationsContentArea>
				<div className={s.signupForm}>
					<SignupFormArea />
				</div>
			</div>
		</>
	)
}

CertificationPage.layout = BaseNewLayout
export default CertificationPage
