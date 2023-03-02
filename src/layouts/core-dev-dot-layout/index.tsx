/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ThemeProvider } from 'next-themes'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { makeWelcomeToast } from 'lib/make-welcome-notification'
import { MobileMenuProvider } from 'contexts'
import TabProvider from 'components/tabs/provider'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children, theme }: CoreDevDotLayoutProps) => {
	const router = useRouter()
	const { asPath, pathname, isReady } = router

	const isSwingset = asPath.startsWith('/swingset')
	const isToastPath = pathname !== '/' && pathname !== '/_error' && !isSwingset

	useEffect(() => {
		if (isReady && isToastPath) {
			makeWelcomeToast()
		}
	}, [isReady, isToastPath])

	return (
		<ThemeProvider disableTransitionOnChange forcedTheme={theme || null}>
			<MobileMenuProvider>
				<TabProvider>
					<Head>
						<DatadogHeadTag />
					</Head>
					<div className={s.root}>{children}</div>
					{isSwingset ? null : <DatadogScriptTag />}
				</TabProvider>
			</MobileMenuProvider>
		</ThemeProvider>
	)
}

export default CoreDevDotLayout
