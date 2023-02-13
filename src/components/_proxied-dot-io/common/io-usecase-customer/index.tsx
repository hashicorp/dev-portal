/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as React from 'react'
import type { ImageProps } from 'next/legacy/image'
import Image from 'next/legacy/image'
import Button from '@hashicorp/react-button'
import s from './style.module.css'

type SelectImageProps = Pick<ImageProps, 'src' | 'width' | 'height' | 'alt'>

interface IoUsecaseCustomerProps {
	media: SelectImageProps
	logo: SelectImageProps
	heading: string
	description: string
	stats?: Array<{
		value: string
		key: string
	}>
	link: string
}

export default function IoUsecaseCustomer({
	media,
	logo,
	heading,
	description,
	stats,
	link,
}: IoUsecaseCustomerProps): React.ReactElement {
	return (
		<section className={s.customer}>
			<div className={s.container}>
				<div className={s.columns}>
					<div className={s.media}>
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<Image {...media} layout="responsive" />
					</div>
					<div className={s.content}>
						<div className={s.eyebrow}>
							<div className={s.eyebrowLogo}>
								{/* eslint-disable-next-line jsx-a11y/alt-text */}
								<Image {...logo} />
							</div>
							<span className={s.eyebrowLabel}>Customer case study</span>
						</div>
						<h2 className={s.heading}>{heading}</h2>
						<p className={s.description}>{description}</p>
						{link ? (
							<div className={s.cta}>
								<Button
									title="Read more"
									url={link}
									theme={{
										brand: 'neutral',
										variant: 'secondary',
										background: 'dark',
									}}
								/>
							</div>
						) : null}
					</div>
				</div>
				{stats.length > 0 ? (
					<ul className={s.stats}>
						{stats.map(({ key, value }, index) => {
							return (
								// Index is stable
								// eslint-disable-next-line react/no-array-index-key
								<li key={index}>
									<p className={s.value}>{value}</p>
									<p className={s.key}>{key}</p>
								</li>
							)
						})}
					</ul>
				) : null}
			</div>
		</section>
	)
}
