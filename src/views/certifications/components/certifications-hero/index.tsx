import { ReactNode } from 'react'
import classNames from 'classnames'
import { CertificationsContentArea } from 'views/certifications/components'
import s from './certifications-hero.module.css'

export function CertificationsHero({
	heading,
	description,
	backgroundSlot,
	imageSlot,
	foreground = 'dark',
}: {
	heading: string
	description: string
	backgroundSlot?: ReactNode
	imageSlot?: ReactNode
	foreground?: 'dark' | 'light'
}) {
	return (
		<div className={s.root}>
			{backgroundSlot ? backgroundSlot : null}
			<CertificationsContentArea>
				<div className={s.textAndImage}>
					<div className={s.textSlot}>
						<h1
							className={classNames(s.heading, s[`foreground-${foreground}`])}
						>
							{heading}
						</h1>
						<p
							className={classNames(
								s.description,
								s[`foreground-${foreground}`]
							)}
						>
							{description}
						</p>
					</div>
					{imageSlot ? <div className={s.imageSlot}>{imageSlot}</div> : null}
				</div>
			</CertificationsContentArea>
		</div>
	)
}
