/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import { CertificationsMaxWidth } from 'views/certifications/components'
import { CertificationsHeroProps } from './types'
import s from './certifications-hero.module.css'

/**
 * Render a certifications hero with a consistent layout.
 *
 * `startSlot` is a render slot that will be rendered on the left side of the
 * hero. On smaller viewports, `startSlot` is rendered at the top of the hero.
 *
 * `endSlot` is an optional render slot that will be rendered on the right side
 * of the hero. On smaller viewports, `endSlot` is rendered below `startSlot`.
 *
 * `backgroundClassName` is required. Without it, the hero will render a
 * plain white background. An empty string can be passed if a plain
 * white background is desired.
 */
function CertificationsHero({
	backgroundClassName,
	startSlot,
	endSlot,
}: {
	backgroundClassName: string
	startSlot: ReactNode
	endSlot?: ReactNode
}) {
	return (
		<div className={s.root}>
			<div className={classNames(s.backgroundBase, backgroundClassName)} />
			<CertificationsMaxWidth>
				<div className={s.rootLayout}>
					<div className={s.startSlot}>{startSlot}</div>
					{endSlot ? <div className={s.endSlot}>{endSlot}</div> : null}
				</div>
			</CertificationsMaxWidth>
		</div>
	)
}

/**
 * Render a heading and descriptive text within a CertificationsHero.
 */
function CertificationsHeroText({
	heading,
	description,
	foreground,
}: {
	heading: string
	description?: string
	foreground: 'light' | 'dark'
}) {
	return (
		<div className={classNames(s.textRoot, s[`foreground-${foreground}`])}>
			<h1
				className={s.textHeading}
				dangerouslySetInnerHTML={{ __html: heading }}
			/>
			{description?.length ? (
				<p
					className={s.textDescription}
					dangerouslySetInnerHTML={{
						__html: mitigateWidows(description, 18),
					}}
				/>
			) : null}
		</div>
	)
}

export type { CertificationsHeroProps }
export { CertificationsHero, CertificationsHeroText }
