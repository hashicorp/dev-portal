/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ButtonProps } from 'components/button'
import { LinkProps } from 'components/link'

/**
 * The inherited props from Button and Link.
 */
type InheritedButtonProps = Pick<
	ButtonProps,
	'color' | 'icon' | 'iconPosition' | 'size' | 'text'
>
type InheritedLinkProps = Pick<
	LinkProps,
	'aria-label' | 'className' | 'href' | 'onClick' | 'opensInNewTab'
>

/**
 * The additional custom props for ButtonLink.
 */
interface ButtonLinkProps extends InheritedButtonProps, InheritedLinkProps {}

export type { ButtonLinkProps }
