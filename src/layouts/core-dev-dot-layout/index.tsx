/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { makeDarkModeToast } from 'lib/toast/make-dark-mode-notification'
import isThemedPath from 'lib/isThemedPath'
import { MobileMenuProvider } from 'contexts'
import TabProvider from 'components/tabs/provider'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
	const router = useRouter()
	const { asPath, pathname, isReady } = router

	const isToastPath = isThemedPath(pathname)

	useEffect(() => {
		if (isReady && isToastPath) {
			makeDarkModeToast()
		}
	}, [isReady, isToastPath])

	return (
		<MobileMenuProvider>
			<TabProvider>
				<Head>
					<DatadogHeadTag />
				</Head>
				<div className={s.root}>{children}</div>
				<DatadogScriptTag />
			</TabProvider>
		</MobileMenuProvider>
	)
}

export function CoreDevDotLayoutWithTheme(props: CoreDevDotLayoutProps) {
	return (
		<ThemeProvider disableTransitionOnChange>
			<CoreDevDotLayout {...props} />
		</ThemeProvider>
	)
}

export default CoreDevDotLayout
