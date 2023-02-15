/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import slugify from 'slugify'
import Heading from 'components/heading'
import Link from 'components/link'
import Text from 'components/text'
import type { HeroProps } from './types'
import Hero from './hero'
import s from './hero.module.css'

type ActionProps = {
	heading: string
	description: string
	link: string
	linkText: string
	theme?: 'green' | 'purple'
}

interface HeroWithActionsProps extends HeroProps {
	actions: Array<ActionProps>
}

function HeroWithActions({
	heading,
	description,
	actions,
}: HeroWithActionsProps) {
	return (
		<Hero className={s.withActions} heading={heading} description={description}>
			<ul className={s.actions}>
				{actions.map((action, index) => {
					const slug = slugify(action.heading)
					const theme = action.theme || index === 0 ? 'green' : 'purple'
					return (
						<li key={slug} className={s.actionsItem}>
							<article className={classNames(s.action, s[theme])}>
								<div className={s.actionInner}>
									<Heading
										className={s.actionHeading}
										level={2}
										size={400}
										weight="bold"
										id={slug}
									>
										{action.heading}
									</Heading>
									<Text className={s.actionDescription} size={200}>
										{action.description}
									</Text>
									<Link className={s.actionLink} href={action.link}>
										{action.linkText}
									</Link>
								</div>
							</article>
						</li>
					)
				})}
			</ul>
		</Hero>
	)
}

export { HeroWithActions }
