/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FC } from 'react'
import type { NextPage } from 'next'
import type { AppProps, AppContext } from 'next/app'
import { CurrentContentType } from 'contexts'
import { ThemeOption } from 'lib/learn-client/types'

type CustomPageComponent<
	PageProps = Record<string, unknown>,
	InitialProps = PageProps
> = NextPage<PageProps, InitialProps> & {
	contentType?: CurrentContentType
	layout?: FC
	theme?: ThemeOption
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
