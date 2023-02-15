/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import { validateNavigationDisclosureListChildren } from 'components/navigation-disclosure/helpers'
import { NavigationDisclosureListProps } from './types'
import s from './navigation-disclosure-list.module.css'

/**
 * Component for rendering the `<ul>` element within the content of a
 * `NavigationDisclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureList = ({
	children,
	className,
}: NavigationDisclosureListProps) => {
	validateNavigationDisclosureListChildren(children)

	return <ul className={classNames(s.root, className)}>{children}</ul>
}

export type { NavigationDisclosureListProps }
export default NavigationDisclosureList
