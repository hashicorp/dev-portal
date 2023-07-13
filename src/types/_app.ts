/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { FC } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

type CustomPageComponent<
	PageProps = Record<string, unknown>,
	InitialProps = PageProps
> = NextPage<PageProps, InitialProps> & {
	layout?: FC
}

type ContextWithLayout = {
	Component: CustomPageComponent
}

/**
 * This is our custom type for our Next.js `App` component
 */
type CustomAppProps = AppProps<$TSFixMe> & ContextWithLayout

export type { CustomPageComponent, CustomAppProps }
