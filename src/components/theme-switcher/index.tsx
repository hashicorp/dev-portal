/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { IconMonitor16 } from '@hashicorp/flight-icons/svg-react/monitor-16'
import { IconMoon16 } from '@hashicorp/flight-icons/svg-react/moon-16'
import { IconSun16 } from '@hashicorp/flight-icons/svg-react/sun-16'
import { useState, useEffect, ReactElement } from 'react'
import { useTheme } from 'next-themes'

import { GlobalThemeOption } from 'styles/themes/types'
import s from './theme-switcher.module.css'

interface ThemeConfig {
	icon: ReactElement
	label: string
	value: string
}

const THEME_CONFIGS: { [key in GlobalThemeOption]: ThemeConfig } = {
	[GlobalThemeOption.dark]: {
		icon: <IconMoon16 />,
		label: 'Dark',
		value: 'dark',
	},
	[GlobalThemeOption.light]: {
		icon: <IconSun16 />,
		label: 'Light',
		value: 'light',
	},
	[GlobalThemeOption.system]: {
		icon: <IconMonitor16 />,
		label: 'System',
		value: 'system',
	},
}

interface ThemeSelectProps {
	id?: string
}

export default function ThemeSelect({ id }: ThemeSelectProps) {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	// @TODO swap this with a loading skeleton
	if (!mounted) {
		return null
	}

	// If no `id` is given, generate an `aria-label` that matches selected option
	let ariaLabel
	const hasId = id?.length > 0
	if (!hasId) {
		ariaLabel = THEME_CONFIGS[theme].label
	}

	return (
		<div className={s.root}>
			<span className={s.themeIcon}>{THEME_CONFIGS[theme].icon}</span>
			<select
				aria-label={ariaLabel}
				className={s.select}
				id={id}
				value={theme}
				onChange={(e) => setTheme(e.target.value)}
			>
				{Object.values(THEME_CONFIGS).map(({ label, value }: ThemeConfig) => (
					<option key={value} value={value}>
						{label}
					</option>
				))}
			</select>
			<span className={s.trailingIcon}>
				<IconCaret16 />
			</span>
		</div>
	)
}
