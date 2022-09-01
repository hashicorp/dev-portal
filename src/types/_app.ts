import type { AppProps, AppContext } from 'next/app'

import type { PageWithLayout } from './layouts'

type ContextWithLayout = {
	Component: PageWithLayout
}

type AppContextNoComponent = Omit<AppContext, 'Component'>

/**
 * This is our custom param type for `App.getInitialProps`
 */
export type CustomAppContext<T = Record<string, unknown>> =
	AppContextNoComponent & ContextWithLayout & T

/**
 * This is our custom type for our Next.js `App` component
 */
export type CustomAppProps = AppProps & ContextWithLayout
