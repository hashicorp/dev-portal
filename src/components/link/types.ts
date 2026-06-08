/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ComponentProps } from 'react'
import NextLink from 'next/link'

interface LinkProps extends ComponentProps<typeof NextLink> {
	opensInNewTab?: boolean
}

export type { LinkProps }
