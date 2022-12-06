import { CertificationsContentArea } from '../'
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
				<h1>{heading}</h1>
				<p>{description}</p>
			</CertificationsContentArea>
			<div className={s.background}></div>
		</div>
	)
}
