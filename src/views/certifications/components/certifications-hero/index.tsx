import { CertificationsContentArea } from '..'
import s from './certifications-hero.module.css'

export function CertificationsHero({
	heading,
	description,
}: {
	heading: string
	description: string
}) {
	return (
		<div className={s.root}>
			<CertificationsContentArea>
				<div className={s.text}>
					<h1 className={s.heading}>{heading}</h1>
					<p className={s.description}>{description}</p>
				</div>
			</CertificationsContentArea>
		</div>
	)
}
