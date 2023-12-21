/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image.svg'
import s from './landing-hero.module.css'
import { HTMLAttributes } from 'react'
import { Hero, HeroText } from './components/hero'

interface LandingHeroProps extends HTMLAttributes<HTMLDivElement> {
	heading: string
	description?: string
	isHvd?: boolean
}

function LandingHero({
	heading,
	description,
	isHvd = false,
	className,
}: LandingHeroProps) {
	return (
		<Hero
			backgroundClassName={s.heroBackground}
			className={className}
			startSlot={
				<HeroText
					className={className}
					heading={heading}
					description={description ?? ''}
					foreground="light"
				/>
			}
			endSlot={
				isHvd ? null : (
					<div className={s.heroImage}>
						<Image alt="" src={svgHeroImage} width={447} height={515} />
					</div>
				)
			}
		/>
	)
}

export default LandingHero
