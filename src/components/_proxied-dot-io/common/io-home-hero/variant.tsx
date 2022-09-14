import * as React from 'react'
import Image from 'next/image'
import type { Products } from '@hashicorp/platform-product-meta'
import Button from '@hashicorp/react-button'
import StandaloneLink from '@hashicorp/react-standalone-link'
import classNames from 'classnames'
import s from './variant.module.css'

interface IoHomeHeroVariantProps {
	pattern: string
	brand: Products | 'neutral'
	heading: string
	description: string
	button: {
		title: string
		link: string
	}
	standaloneLink: {
		title: string
		link: string
	}
}

export default function IoHomeHeroVariant({
	pattern,
	brand,
	heading,
	description,
	button,
	standaloneLink,
}: IoHomeHeroVariantProps) {
	return (
		<header className={classNames(s.hero)}>
			<div className={s.container}>
				<div className={s.pattern}>
					<Image src={pattern} layout="fill" objectFit="cover" alt="" />
				</div>
				<div className={s.content}>
					<h1 className={s.heading}>{heading}</h1>
					<p className={s.description}>{description}</p>
					<div className={s.button}>
						<Button
							title={button.title}
							url={button.link}
							theme={{
								brand,
							}}
						/>
					</div>
					<div>
						<StandaloneLink href={standaloneLink.link} theme="tertiary">
							{standaloneLink.title}
						</StandaloneLink>
					</div>
				</div>
			</div>
		</header>
	)
}
