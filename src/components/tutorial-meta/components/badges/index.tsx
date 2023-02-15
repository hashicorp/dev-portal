/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { Product as ClientProduct } from 'lib/learn-client/types'
import { TutorialData } from 'views/tutorial-view'
import getReadableTime, { generateBadges } from './helpers'
import s from './badges.module.css'

export interface BadgesProps {
	options: BadgeOptions
}
export interface BadgeOptions
	extends Pick<TutorialData, 'readTime' | 'edition'> {
	products: Pick<ClientProduct, 'name' | 'slug'>[]
	isBeta: boolean
	hasVideo: boolean
	isInteractive: boolean
}

export function Badges({ options }: BadgesProps): React.ReactElement {
	const { readTime, products, edition, isBeta, hasVideo, isInteractive } =
		options
	const badges = generateBadges({
		edition,
		hasVideo,
		isBeta,
		isInteractive,
		products,
	})

	return (
		<ul className={s.list}>
			<li>
				<p className={s.readTime}>{getReadableTime(readTime)}</p>
			</li>
			{badges.map((badge: ReactElement, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<li key={index}>{badge}</li>
			))}
		</ul>
	)
}
