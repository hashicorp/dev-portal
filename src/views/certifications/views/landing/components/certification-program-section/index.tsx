import ButtonLink from 'components/button-link'
import { CertificationsContentArea } from 'views/certifications/components'
// Local
import { ExamCard, ExamCardComingSoon } from '../'
// Styles
import s from './certification-program-section.module.css'

interface CertificationItem {
	title: string
	productSlug: 'consul' | 'terraform' | 'vault'
	url?: string
}

interface CertificationProgramSectionProps {
	heading: string
	description: string
	overviewCta: {
		text: string
		url: string
	}
	certifications: CertificationItem[]
}

export function CertificationProgramSection({
	heading,
	description,
	overviewCta,
	certifications,
}: CertificationProgramSectionProps) {
	return (
		<>
			<CertificationsContentArea>
				<div className={s.inner}>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '48px',
							border: '1px solid magenta',
							padding: '1rem',
						}}
					>
						<h3
							style={{
								flex: '10em 1 1',
								margin: 0,
							}}
						>
							{heading}
						</h3>
						<div
							style={{
								flex: '18em 2 1',
							}}
						>
							<div>{description}</div>
							<br />
							<div style={{ width: 'min-content' }}>
								<ButtonLink text={overviewCta.text} href={overviewCta.url} />
							</div>
						</div>
					</div>
					<div className={s.examCards}>
						{certifications.map(
							({ title, url, productSlug }: CertificationItem) => {
								return url ? (
									<ExamCard title={title} url={url} productSlug={productSlug} />
								) : (
									<ExamCardComingSoon title={title} productSlug={productSlug} />
								)
							}
						)}
					</div>
				</div>
			</CertificationsContentArea>
		</>
	)
}
