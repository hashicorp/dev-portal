import { FC } from 'react'
import type { NextPage } from 'next'
import type { AppProps, AppContext } from 'next/app'
import { CurrentContentType } from 'contexts'

type CustomPageComponent<
	PageProps = Record<string, unknown>,
	InitialProps = PageProps
> = NextPage<PageProps, InitialProps> & {
	contentType?: CurrentContentType
	layout?: FC
}

type ContextWithLayout = {
	Component: CustomPageComponent
}

type AppContextNoComponent = Omit<AppContext, 'Component'>

/**
 * This is our custom param type for `App.getInitialProps`
 */
type CustomAppContext<T = Record<string, unknown>> = AppContextNoComponent &
	ContextWithLayout &
	T

/**
 * This is our custom type for our Next.js `App` component
 */
type CustomAppProps = AppProps<$TSFixMe> & ContextWithLayout

export type { CustomPageComponent, CustomAppContext, CustomAppProps }
