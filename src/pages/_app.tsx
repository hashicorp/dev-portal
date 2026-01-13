/**
 * Copyright IBM Corp. 2021, 2025
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
import { QueryParamAdapterComponent, QueryParamProvider } from 'use-query-params'
import type { AppProps } from 'next/app'
import { SpeedInsights } from '@vercel/speed-insights/next'

// HashiCorp imports
import { NextImageAdapter, NextLinkAdapter } from '@hashicorp/mds-next'
import { MDSProvider } from '@hashicorp/mds-react/utils'
import {
	initializeUTMParamsCapture,
	addGlobalLinkHandler,
	track,
} from '@hashicorp/platform-analytics'
import '@hashicorp/platform-util/nprogress/style.css'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'

// Global imports
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import { InstruqtProvider } from 'contexts/instruqt-lab'

import { makeDevAnalyticsLogger } from 'lib/analytics'
import { DevDotClient } from 'views/error-views'
import HeadMetadata from 'components/head-metadata'
import { Toaster } from 'components/toast'
import { ConditionalPostHogProvider } from 'components/posthog/posthog-provider'

// Local imports
import './style.css'

if (typeof window !== 'undefined' && process.env.AXE_ENABLED === 'true') {
	import('react-dom').then((ReactDOM) => {
		import('@axe-core/react').then((axe) => {
			axe.default(React, ReactDOM, 1000)
		})
	})
}

if (typeof window !== 'undefined') {
	initializeUTMParamsCapture()
	addGlobalLinkHandler((destinationUrl: string) => {
		track('Outbound link', {
			destination_url: destinationUrl,
		})
	})
}

const Adapter: QueryParamAdapterComponent = (props) => (
  <NextAdapter {...props} />
)

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
			<MDSProvider
				imageComponent={NextImageAdapter}
				linkComponent={NextLinkAdapter}
			>
				<QueryClientProvider client={queryClient}>
					<SSRProvider>
						<QueryParamProvider adapter={Adapter}>
							<ErrorBoundary FallbackComponent={DevDotClient}>
								<SessionProvider session={session}>
									<DeviceSizeProvider>
										<CurrentProductProvider currentProduct={currentProduct}>
											<InstruqtProvider source="sandbox" renderEmbed={true}>
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
											</InstruqtProvider>
										</CurrentProductProvider>
									</DeviceSizeProvider>
								</SessionProvider>
							</ErrorBoundary>
						</QueryParamProvider>
					</SSRProvider>
				</QueryClientProvider>
			</MDSProvider>
		</ConditionalPostHogProvider>
	)
}
