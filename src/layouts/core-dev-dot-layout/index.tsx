/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import Head from 'next/head'
// import { useRouter } from 'next/router'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { makeDarkModeToast } from 'lib/toast/make-dark-mode-notification'
import isThemedPath from 'lib/isThemedPath'
import { MobileMenuProvider } from 'contexts'
import TabProvider from 'components/tabs/provider'
import { GlobalThemeOption } from 'styles/themes/types'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
	// const router = useRouter()
	// const { asPath, pathname, isReady } = router
	const router = useRouter()
	const pathname = usePathname()
	const asPath = usePathname()
	const isReady = true

	const isSwingset = asPath.startsWith('/swingset')
	const isToastPath = isThemedPath(pathname) && !isSwingset

	useEffect(() => {
		if (isReady && isToastPath) {
			makeDarkModeToast()
		}
	}, [isReady, isToastPath])

	return (
		// <MobileMenuProvider>
		<TabProvider>
			<Head>
				<DatadogHeadTag />
			</Head>
			<div className={s.root}>{children}</div>
			{isSwingset ? null : <DatadogScriptTag />}
		</TabProvider>
		// </MobileMenuProvider>
	)
}

export function CoreDevDotLayoutWithTheme(
	props: CoreDevDotLayoutProps & { theme?: GlobalThemeOption }
) {
	const { theme, ...restProps } = props
	return (
		<ThemeProvider disableTransitionOnChange forcedTheme={theme || null}>
			<CoreDevDotLayout {...restProps} />
		</ThemeProvider>
	)
}

export default CoreDevDotLayout
