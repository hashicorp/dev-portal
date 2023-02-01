import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { makeWelcomeToast } from 'lib/make-welcome-notification'
import { MobileMenuProvider } from 'contexts'
import { useDarkMode } from 'contexts/dark-mode'
import TabProvider from 'components/tabs/provider'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
	const router = useRouter()
	const { asPath, pathname, isReady } = router

	const isSwingset = asPath.startsWith('/swingset')
	const isToastPath = pathname !== '/' && pathname !== '/_error' && !isSwingset
	const { isActive } = useDarkMode()

	useEffect(() => {
		if (isReady && isToastPath) {
			makeWelcomeToast()
		}
	}, [isReady, isToastPath])

	return (
		<MobileMenuProvider>
			<TabProvider>
				<Head>
					<DatadogHeadTag />
				</Head>
				<div className={s.root} data-dark-mode={isActive} id="dark-mode-root">
					{children}
				</div>
				{isSwingset ? null : <DatadogScriptTag />}
			</TabProvider>
		</MobileMenuProvider>
	)
}

export default CoreDevDotLayout
