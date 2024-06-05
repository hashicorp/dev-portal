/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { MobileMenuProvider } from 'contexts'
import TabProvider from 'components/tabs/provider'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
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
