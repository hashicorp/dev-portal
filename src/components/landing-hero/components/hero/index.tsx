/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'
import mitigateWidows from '@hashicorp/platform-util/text/mitigate-widows'
import s from './hero.module.css'

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
interface HeroProps extends HTMLAttributes<HTMLDivElement> {
	backgroundClassName: string
	startSlot: ReactNode
	endSlot?: ReactNode
}

function Hero({
	backgroundClassName,
	startSlot,
	endSlot,
	className,
}: HeroProps) {
	return (
		<div className={s.root}>
			<div className={classNames(s.backgroundBase, backgroundClassName)} />
			<div className={classNames(s.rootContainer, className)}>
				<div className={s.rootLayout}>
					<div className={s.startSlot}>{startSlot}</div>
					{endSlot ? <div className={s.endSlot}>{endSlot}</div> : null}
				</div>
			</div>
		</div>
	)
}

/**
 * Render a heading and descriptive text within a Hero.
 */
function HeroText({
	heading,
	description,
	foreground,
}: {
	heading: string
	description: string
	foreground: 'light' | 'dark'
}) {
	return (
		<div className={classNames(s.textRoot, s[`foreground-${foreground}`])}>
			<h1
				className={s.textHeading}
				dangerouslySetInnerHTML={{ __html: heading }}
			/>
			<p
				className={s.textDescription}
				dangerouslySetInnerHTML={{
					__html: mitigateWidows(description, 18),
				}}
			/>
		</div>
	)
}

export { Hero, HeroText }
