/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

/**
 *
 * @TODO this is just an FPO component for testing, will be updated when the final switcher is designed
 */

export default function ThemeSwitch() {
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
		<select value={theme} onChange={(e) => setTheme(e.target.value)}>
			<option value="system">System</option>
			<option value="dark">Dark</option>
			<option value="light">Light</option>
		</select>
	)
}
