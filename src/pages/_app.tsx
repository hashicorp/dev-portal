/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import React, { useEffect, useState } from 'react'
import { SSRProvider } from '@react-aria/ssr'
import { ErrorBoundary } from 'react-error-boundary'
import { LazyMotion } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import { type Session } from 'next-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextAdapter } from 'next-query-params'
import { QueryParamProvider } from 'use-query-params'
import type { AppProps } from 'next/app'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ConditionalPostHogProvider } from '@components/posthog/posthog-provider'

// HashiCorp imports
import {
	initializeUTMParamsCapture,
	addGlobalLinkHandler,
	track,
} from '@hashicorp/platform-analytics'
import '@hashicorp/platform-util/nprogress/style.css'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'

// Global imports
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import { makeDevAnalyticsLogger } from 'lib/analytics'
import { DevDotClient } from 'views/error-views'
import HeadMetadata from 'components/head-metadata'
import { Toaster } from 'components/toast'

// Local imports
import './style.css'
import '@hashicorp/react-design-system-components/src/design-system-components.scss'

if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
	import('react-dom').then((ReactDOM) => {
		import('@axe-core/react').then((axe) => {
			axe.default(React, ReactDOM, 1000)
		})
	})
}

initializeUTMParamsCapture()
addGlobalLinkHandler((destinationUrl: string) => {
	track('Outbound link', {
		destination_url: destinationUrl,
	})
})

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<{ session?: Session } & Record<string, $TSFixMe>>) {
	useAnchorLinkAnalytics()
	useEffect(() => makeDevAnalyticsLogger(), [])

	/**
	 * Initialize QueryClient with `useState` to ensure that data is not shared
	 * between different users and requests, and that only one is created per
	 * component lifecycle.
	 */
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// TODO: refine this value or set by HASHI_ENV
						staleTime: Infinity,
					},
				},
			})
	)

	const currentProduct = pageProps.product || null

	return (
		<ConditionalPostHogProvider>
			<QueryClientProvider client={queryClient}>
				<SSRProvider>
					<QueryParamProvider adapter={NextAdapter}>
						<ErrorBoundary FallbackComponent={DevDotClient}>
							<SessionProvider session={session}>
								<DeviceSizeProvider>
									<CurrentProductProvider currentProduct={currentProduct}>
										<HeadMetadata {...pageProps.metadata} />
										<LazyMotion
											features={() =>
												import('lib/framer-motion-features').then(
													(mod) => mod.default
												)
											}
											strict={process.env.NODE_ENV === 'development'}
										>
											<Component {...pageProps} />
											<Toaster />
											<ReactQueryDevtools />
											<SpeedInsights sampleRate={0.05} />
										</LazyMotion>
									</CurrentProductProvider>
								</DeviceSizeProvider>
							</SessionProvider>
						</ErrorBoundary>
					</QueryParamProvider>
				</SSRProvider>
			</QueryClientProvider>
		</ConditionalPostHogProvider>
	)
}
