/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import classNames from 'classnames'
import Heading from 'components/heading'
import { HeroProps } from './types'
import s from './hero.module.css'

export default function Hero({
	className,
	heading,
	description,
	children,
}: HeroProps & {
	children: ReactElement
}) {
	return (
		<header className={classNames(s.hero, className)}>
			<div className={s.container}>
				<div className={s.primary}>
					<Heading
						className={s.title}
						level={1}
						size={500}
						id="welcome-to-dev-portal"
						weight="bold"
					>
						{heading}
					</Heading>
					<div className={s.description}>{description}</div>
				</div>

				<div className={s.secondary}>{children}</div>
			</div>
		</header>
	)
}
