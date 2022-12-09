import classNames from 'classnames'
// Global
import BaseNewLayout from 'layouts/base-new'
// Shared view components
import { CertificationsNav, CertificationsHero } from '../../components'
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
						key={certification.title}
						slug={slug}
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
			{/* <CertificationsContentArea>
				<h2>{`[dev]`} Content Debug</h2>
				<pre
					className="hds-typography-code-100"
					style={{
						whiteSpace: 'pre-wrap',
						background: '#EEEEEE',
						padding: '2rem',
					}}
				>
					<code>{JSON.stringify({ pageContent }, null, 2)}</code>
				</pre>
			</CertificationsContentArea> */}
		</>
	)
}

CertificationPage.layout = BaseNewLayout
export default CertificationPage
