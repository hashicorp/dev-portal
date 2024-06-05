/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import s from './page-hero.module.css'

interface PageHeroProps {
	className?: string
	title: string
	subtitle: string
}

const PageHero = ({ className, subtitle, title }: PageHeroProps) => {
	return (
		<header className={classNames(s.root, className)}>
			<h1 className={s.title}>{title}</h1>
			<p className={s.subtitle}>{subtitle}</p>
		</header>
	)
}

export { PageHero }
