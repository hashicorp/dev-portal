import * as React from 'react'
import Image from 'next/image'
import type { Products } from '@hashicorp/platform-product-meta'
import Intro from '@hashicorp/react-intro'
import s from './style.module.css'

interface IoHomeHeroAltProps {
	brand: Products
	heading: string
	description: string
	ctas?: Array<{
		title: string
		link: string
	}>
}

export default function IoHomeHeroAlt({
	brand,
	heading,
	description,
}: IoHomeHeroAltProps) {
	return (
		<header className={s.hero}>
			<div className={s.patterns}>
				<Image
					className={s.patternsStart}
					src={require('./pattern-start.svg')}
					width={418}
					height={543}
					alt=""
				/>
				<Image
					className={s.patternsEnd}
					src={require('./pattern-end.svg')}
					width={418}
					height={543}
					alt=""
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
							ctas: [
								{
									title: 'Try Vault Cloud',
									href: '/',
								},
								{
									title: 'Install Vault',
									href: '/',
									type: 'standalone-link',
								},
							],
						}}
					/>
				</div>
			</div>
		</header>
	)
}
