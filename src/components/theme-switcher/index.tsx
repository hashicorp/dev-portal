/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { IconMonitor16 } from '@hashicorp/flight-icons/svg-react/monitor-16'
import { IconMoon16 } from '@hashicorp/flight-icons/svg-react/moon-16'
import { IconSun16 } from '@hashicorp/flight-icons/svg-react/sun-16'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

import { GlobalThemeOption } from 'styles/themes/types'
import s from './theme-switcher.module.css'

interface ThemeSelectProps {
	id?: string
}

const ThemeIcons = {
	[GlobalThemeOption.system]: <IconMonitor16 />,
	[GlobalThemeOption.dark]: <IconMoon16 />,
	[GlobalThemeOption.light]: <IconSun16 />,
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

	return (
		<div className={s.root}>
			<span className={s.themeIcon}>{ThemeIcons[theme]}</span>
			<select
				className={s.select}
				id={id}
				value={theme}
				onChange={(e) => setTheme(e.target.value)}
			>
				<option value="system">System</option>
				<option value="dark">Dark</option>
				<option value="light">Light</option>
			</select>
			<span className={s.trailingIcon}>
				<IconCaret16 />
			</span>
		</div>
	)
}

export function ThemeSelectWithLabel({ id }: Required<ThemeSelectProps>) {
	return (
		<>
			<label className={s.label} htmlFor={id}>
				Theme
			</label>
			<ThemeSelect id={id} />
		</>
	)
}
