/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { StandaloneLinkProps } from 'components/standalone-link'

interface MobileStandaloneLinkProps extends Omit<StandaloneLinkProps, 'icon'> {
	/**
	 * Required. The text a screen reader will use to present this element on
	 * focus. This is required because only the icon is rendered on mobile, and an
	 * icon-only element must have an accessible label.
	 */
	ariaLabel: StandaloneLinkProps['ariaLabel']

	/**
	 * Required. The icon to render on tablet or wider viewport widths.
	 */
	size16Icon: StandaloneLinkProps['icon']

	/**
	 * Required. The icon to render on mobile widths.
	 */
	size24Icon: StandaloneLinkProps['icon']
}

export type { MobileStandaloneLinkProps }
