/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import Button from '@hashicorp/react-button'
import Card from 'components/card'
import { FeaturedCardProps } from './types'
import s from './style.module.css'

function FeaturedCard({
	heading,
	image,
	body,
	links,
}: FeaturedCardProps): ReactElement {
	return (
		<Card className={s.root}>
			<article className={s.content}>
				<div className={s.text}>
					<h1 className={s.heading}>{heading}</h1>
					<p className={s.body}>{body}</p>
					<div className={s.ctas}>
						{links.map(({ title, url }, stableIdx) => {
							const variant = stableIdx == 0 ? 'primary' : 'secondary'
							const brand = stableIdx == 0 ? 'neutral' : undefined
							return (
								<Button
									// eslint-disable-next-line react/no-array-index-key
									key={stableIdx}
									theme={{ variant, brand }}
									title={title}
									url={url}
									size="small"
								/>
							)
						})}
					</div>
				</div>
				{image ? (
					<div className={s.image}>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={image.src} alt={image.alt} />
					</div>
				) : null}
			</article>
		</Card>
	)
}

export default FeaturedCard
