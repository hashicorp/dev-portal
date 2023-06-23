/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FC } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { CurrentContentType } from 'contexts'
import { GlobalThemeOption } from 'styles/themes/types'

type CustomPageComponent<
	PageProps = Record<string, unknown>,
	InitialProps = PageProps
> = NextPage<PageProps, InitialProps> & {
	contentType?: CurrentContentType
	layout?: FC
	theme?: GlobalThemeOption
}

type ContextWithLayout = {
	Component: CustomPageComponent
}

/**
 * This is our custom type for our Next.js `App` component
 */
type CustomAppProps = AppProps<$TSFixMe> & ContextWithLayout

export type { CustomPageComponent, CustomAppProps }
