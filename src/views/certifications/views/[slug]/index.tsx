import classNames from 'classnames'
// Global
import BaseNewLayout from 'layouts/base-new'
// Shared view components
import {
	CertificationsNav,
	CertificationsHero,
	GradientCardTheme,
} from '../../components'
// Local view components
import { CertificationProgramDetails } from './components'
import { CertificationPageProps } from './types'
// Styles
import s from './program-view.module.css'

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
			{pageContent.certifications.map((certification) => {
				return (
					<CertificationProgramDetails
						key={slug}
						slug={slug as GradientCardTheme}
						title={certification.title}
						description={certification.description}
						links={certification.links}
						productSlug={certification.productSlug}
						versionTested={certification.versionTested}
						faqItems={certification.faqItems.map((item) => {
							return {
								title: item.title,
								mdxSource: item.mdxSource,
							}
						})}
					/>
				)
			})}
		</>
	)
}

CertificationPage.layout = BaseNewLayout
export default CertificationPage
