/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { CardLinkProps } from 'components/card-link'

export type DirectionOption = 'next' | 'previous' | 'final'

export interface DirectionalLinkBoxProps {
	id?: string
	href: CardLinkProps['href']
	label: string
	name: string
	ariaLabel: CardLinkProps['ariaLabel']
	direction: DirectionOption
}
