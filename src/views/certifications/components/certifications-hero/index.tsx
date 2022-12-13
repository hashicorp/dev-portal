import classNames from 'classnames'
import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import { CertificationsMaxWidth } from 'views/certifications/components'
import { CertificationsHeroProps } from './types'
import s from './certifications-hero.module.css'

/**
 * Re-usable Hero component for Certifications views.
 *
 * Optional `background` and `image` slots are intended to allow the re-use
 * of a consistent layout across pages, while meeting the different styles
 * of hero across Certifications views.
 */
export function CertificationsHero({
	heading,
	description,
	backgroundSlot,
	imageSlot,
	foreground = 'dark',
}: CertificationsHeroProps) {
	return (
		<div className={s.root}>
			{backgroundSlot ? (
				<div className={s.backgroundSlot}>{backgroundSlot}</div>
			) : null}
			<CertificationsMaxWidth>
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
							dangerouslySetInnerHTML={{
								__html: mitigateWidows(description, 18),
							}}
						/>
					</div>
					{imageSlot ? <div className={s.imageSlot}>{imageSlot}</div> : null}
				</div>
			</CertificationsMaxWidth>
		</div>
	)
}
