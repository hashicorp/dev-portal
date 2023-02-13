/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ComponentProps } from 'react'
import NextLink from 'next/link'

interface LinkProps extends ComponentProps<typeof NextLink> {
	opensInNewTab?: boolean
}

export type { LinkProps }
