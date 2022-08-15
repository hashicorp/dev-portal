// Third-party imports
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { SSRProvider } from '@react-aria/ssr'
import { ErrorBoundary } from 'react-error-boundary'
import { LazyMotion } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// HashiCorp imports
import '@hashicorp/platform-util/nprogress/style.css'
import useAnchorLinkAnalytics from '@hashicorp/platform-util/anchor-link-analytics'
import CodeTabsProvider from '@hashicorp/react-code-block/provider'

// Global imports
import {
	AllProductDataProvider,
	CurrentProductProvider,
	DeviceSizeProvider,
} from 'contexts'
import fetchLayoutProps from 'lib/_proxied-dot-io/fetch-layout-props'
import { isDeployPreview, isPreview } from 'lib/env-checks'
import { makeDevAnalyticsLogger } from 'lib/analytics'
import EmptyLayout from 'layouts/empty'
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

export default function App({
	Component,
	pageProps: { session, ...pageProps },
	layoutProps,
	host,
}) {
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

	const Layout = Component.layout ?? EmptyLayout
	const currentProduct = pageProps.product || null

	/**
	 * TODO: refactor this so that pageProps.layoutProps is the only place where
	 * layoutProps come from.
	 */
	const allLayoutProps = {
		...pageProps.layoutProps,
		...layoutProps,
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SSRProvider>
				<ErrorBoundary FallbackComponent={DevDotClient}>
					<SessionProvider session={session}>
						<DeviceSizeProvider>
							<AllProductDataProvider>
								<CurrentProductProvider currentProduct={currentProduct}>
									<CodeTabsProvider>
										<HeadMetadata {...pageProps.metadata} host={host} />
										<LazyMotion
											features={() =>
												import('lib/framer-motion-features').then(
													(mod) => mod.default
												)
											}
											strict={process.env.NODE_ENV === 'development'}
										>
											<Layout {...allLayoutProps} data={allLayoutProps}>
												<Component {...pageProps} />
											</Layout>
											<Toaster />
											{showProductSwitcher ? <PreviewProductSwitcher /> : null}
											<ReactQueryDevtools />
										</LazyMotion>
									</CodeTabsProvider>
								</CurrentProductProvider>
							</AllProductDataProvider>
						</DeviceSizeProvider>
					</SessionProvider>
				</ErrorBoundary>
			</SSRProvider>
		</QueryClientProvider>
	)
}

App.getInitialProps = async ({ Component, ctx }) => {
	// Determine the product being served through our rewrites so we can fetch the correct layout data
	let proxiedProduct
	if (ctx.pathname.includes('_proxied-dot-io/vault')) {
		proxiedProduct = 'vault'
	} else if (ctx.pathname.includes('_proxied-dot-io/consul')) {
		proxiedProduct = 'consul'
	} else if (ctx.pathname.includes('_proxied-dot-io/nomad')) {
		proxiedProduct = 'nomad'
	} else if (ctx.pathname.includes('_proxied-dot-io/boundary')) {
		proxiedProduct = 'boundary'
	}
	const layoutProps = await fetchLayoutProps(Component.layout, proxiedProduct)

	let pageProps = {}

	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx)
	}

	let host
	if (ctx.req) {
		host = ctx.req.headers.host
	}

	return {
		pageProps,
		layoutProps,
		host,
	}
}
