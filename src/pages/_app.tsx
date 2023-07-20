/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Third-party imports
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
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
import { useFlags } from 'flags/client'
import { FlagBagProvider } from 'flags/client'
import '@reach/dialog/styles.css'

// HashiCorp imports
import {
	initializeUTMParamsCapture,
	addGlobalLinkHandler,
	track,
} from '@hashicorp/platform-analytics'
import '@hashicorp/platform-util/nprogress/style.css'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import CodeTabsProvider from '@hashicorp/react-code-block/provider'

// Global imports
import { CurrentProductProvider, DeviceSizeProvider } from 'contexts'
import { isDeployPreview, isPreview } from 'lib/env-checks'
import { makeDevAnalyticsLogger } from 'lib/analytics'
import { DevDotClient } from 'views/error-views'
import HeadMetadata from 'components/head-metadata'
import { Toaster } from 'components/toast'

// Local imports
import './style.css'

const showProductSwitcher = isPreview() && !isDeployPreview()

const PreviewProductSwitcher = dynamic(
	() => import('components/_proxied-dot-io/common/preview-product-select'),
	{ ssr: false }
)

if (typeof window !== 'undefined' && process.env.AXE_ENABLED) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const ReactDOM = require('react-dom')
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const axe = require('@axe-core/react')
	axe(React, ReactDOM, 1000)
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
}: AppProps<{ session?: Session } & Record<string, any>>) {
	console.log('App', session)
	const flagBag = useFlags()
	useAnchorLinkAnalytics()
	useEffect(() => makeDevAnalyticsLogger(), [])

	/**
	 * Initalize QueryClient with `useState` to ensure that data is not shared
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
		<QueryClientProvider client={queryClient}>
			<SSRProvider>
				<QueryParamProvider adapter={NextAdapter}>
					<ErrorBoundary FallbackComponent={DevDotClient}>
						<FlagBagProvider value={flagBag}>
							<SessionProvider session={session}>
								<DeviceSizeProvider>
									<CurrentProductProvider currentProduct={currentProduct}>
										<CodeTabsProvider>
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
												{showProductSwitcher ? (
													<PreviewProductSwitcher />
												) : null}
												<ReactQueryDevtools />
											</LazyMotion>
										</CodeTabsProvider>
									</CurrentProductProvider>
								</DeviceSizeProvider>
							</SessionProvider>
						</FlagBagProvider>
					</ErrorBoundary>
				</QueryParamProvider>
			</SSRProvider>
		</QueryClientProvider>
	)
}
