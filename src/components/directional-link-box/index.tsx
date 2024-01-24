/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import classNames from 'classnames'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { IconSliders16 } from '@hashicorp/flight-icons/svg-react/sliders-16'
import Link from 'components/link'
import Text from 'components/text'
import { DirectionalLinkBoxProps, DirectionOption } from './types'
import s from './directional-link-box.module.css'

const IconDict: { [k in DirectionOption]: typeof IconArrowRight16 } = {
	next: IconArrowRight16,
	previous: IconArrowLeft16,
	final: IconSliders16,
}

function DirectionalLinkBox({
	id,
	href,
	label,
	name,
	ariaLabel,
	direction,
}: DirectionalLinkBoxProps) {
	const Icon = IconDict[direction]

	return (
		<Link
			// Next.js's Link will attempt to refocus itself after a page transition, in order to keep the user focused on what it believes to be the same content. (https://github.com/vercel/next.js/issues/49386) This makes sense for a menu buttons/links, but not for content buttons/links.
			id={id || undefined}
			key={id || undefined}
			className={classNames(s.linkbox, s[`direction-${direction}`])}
			href={href}
			aria-label={ariaLabel}
			data-heap-track={`directional-link-box-${direction}`}
		>
			<span className={s.directionLabel}>
				{' '}
				<Icon className={classNames(s.icon, s[`direction-${direction}`])} />
				<Text
					className={s.labelText}
					asElement="span"
					size={200}
					weight="medium"
				>
					{label}
				</Text>
			</span>
			<Text className={s.name}>{name}</Text>
		</Link>
	)
}

export default DirectionalLinkBox
