import * as React from 'react'
import Image from 'next/image'
import type { Products } from '@hashicorp/platform-product-meta'
import type { IntroProps } from '@hashicorp/react-intro/types'
import Intro from '@hashicorp/react-intro'
import s from './style.module.css'

interface IoHomeHeroAltProps {
	brand: Products
	patterns: {
		start: string
		end: string
	}
	heading: IntroProps['heading']
	description: IntroProps['description']
	ctas: IntroProps['actions']['ctas']
}

export default function IoHomeHeroAlt({
	brand,
	patterns,
	heading,
	description,
	ctas,
}: IoHomeHeroAltProps) {
	return (
		<header className={s.hero}>
			<div className={s.patterns}>
				<Image
					className={s.patternsStart}
					src={patterns.start}
					width={418}
					height={543}
					alt=""
					priority
				/>
				<Image
					className={s.patternsEnd}
					src={patterns.end}
					width={418}
					height={543}
					alt=""
					priority
				/>
			</div>
			<div className={s.container}>
				<div className={s.inner}>
					<Intro
						textAlignment="center"
						heading={heading}
						headingSize={1}
						description={description}
						actions={{
							layout: 'stacked',
							theme: brand,
							ctas: ctas.map(
								(cta: { title: string; href: string }, index: number) => {
									return {
										...cta,
										type: index === 0 ? 'button' : 'standalone-link',
									}
								}
							) as IntroProps['actions']['ctas'],
						}}
					/>
				</div>
			</div>
		</header>
	)
}
