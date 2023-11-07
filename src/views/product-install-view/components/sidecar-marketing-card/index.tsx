/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import slugify from 'slugify'
import Card from 'components/card'
import Link from 'components/link'
import Text from 'components/text'
import { SidecarMarketingCardProps } from './types'
import s from './sidecar-marketing-card.module.css'

const SidecarMarketingCard = ({
	title,
	subtitle,
	featuredDocsLinks,
}: SidecarMarketingCardProps): ReactElement => {
	return (
		<Card elevation="base">
			<Text className={s.cardTitle} size={300} weight="semibold">
				{title}
			</Text>
			<Text className={s.cardSubtitle} size={200} weight="regular">
				{subtitle}
			</Text>
			<Text className={s.featuredDocsLabel} size={200} weight="semibold">
				Featured docs
			</Text>
			<ul className={s.featuredDocsLinksList}>
				{featuredDocsLinks.map(({ href, text }) => (
					<Text
						className={s.featuredDocsListItem}
						asElement="li"
						key={slugify(text)}
						size={200}
						weight="regular"
					>
						<Link className={s.featuredDocsLink} href={href}>
							{text}
						</Link>
					</Text>
				))}
			</ul>
		</Card>
	)
}

export type { SidecarMarketingCardProps }
export default SidecarMarketingCard
