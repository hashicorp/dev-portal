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
			<h1>{heading}</h1>
			<p>{description}</p>
		</div>
	)
}
