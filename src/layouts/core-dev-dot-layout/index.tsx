import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { makeWelcomeToast } from 'lib/make-welcome-notification'
import { MobileMenuProvider } from 'contexts'

import { CoreDevDotLayoutProps } from './types'

import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
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
		<MobileMenuProvider>
			<Head>
				<DatadogHeadTag />
			</Head>
			<div className={s.root}>{children}</div>
			{isSwingset ? null : <DatadogScriptTag />}
		</MobileMenuProvider>
	)
}

export default CoreDevDotLayout
