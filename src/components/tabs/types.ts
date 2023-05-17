/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { TabProps } from './components/tab'

/**
 * TODO: We more than likely want to require an accessible label on Tabs in the
 * future, but we do not currently require it on our existing Tabs from
 * react-components. For migration purposes, labels are not currently marked as
 * required.
 *
 * The commented out code below this `TabsProps` interface is how we would
 * accomplish requiring either `aria-label` or `aria-labelledby`.
 */
export interface TabsProps {
	/**
	 * A non-visible label describing the purpose of the Tabs
	 */
	ariaLabel?: string

	/**
	 * The `id` of an element containing a label describing the purpose of the
	 * Tabs
	 */
	ariaLabelledBy?: string

	/**
	 * At least two `Tab` components, one for each button and panel to render
	 */
	children: ReactNode

	/**
	 * The index of the tab to show as active on initial render
	 */
	initialActiveIndex?: number

	/**
	 * Set to true to enable nested styles. Defaults to false.
	 * Note that allowing nested styles means showAnchorLine will be ignored.
	 */
	allowNestedStyles?: boolean

	/**
	 * Whether or not a full-width border should be shown below the tab buttons
	 */
	showAnchorLine?: boolean

	/**
	 * Optional prop for customizing the overall style of the tabs. Defaults to
	 * "normal".
	 */
	variant?: 'normal' | 'compact'

	/**
	 * Optional callback for when the active tab changes.
	 */
	onChange?: (newActiveIndex: number) => void
}

// interface BaseProps {
//   children: ReactNode
//   initialActiveIndex?: number
// }

// interface PropsForAriaLabel extends BaseProps {
//   ariaLabel: string
//   ariaLabelledBy?: never
// }

// interface PropsForAriaLabelledBy extends BaseProps {
//   ariaLabel?: never
//   ariaLabelledBy: string
// }

// export type TabsProps = PropsForAriaLabel | PropsForAriaLabelledBy

/**
 * RawTabItem is used for items parsed directly from <Tab /> children
 */
export interface RawTabItem {
	content: ReactNode
	group?: string
	icon?: TabProps['icon']
	/**
	 * The `label` is plain text used with `<select />`-based tab controls.
	 * It is always required, as we must use `<select />`-based tab controls on
	 * certain smaller viewport sizes.
	 */
	label: string

	/**
	 * The optional `labelSlot` is used with `<button />`-based tab controls.
	 * It allows rendering arbitrary content, and generally appears only
	 * at larger viewport sizes.
	 *
	 * If `labelSlot` is not provided, the `label` string will be used with
	 * both the `<select />` and `<button />` based tab controls.
	 */
	labelSlot?: TabProps['headingSlot']
}

/**
 * RawTabItemWithID includes tabId & panelId properties.
 * These are regenerated at the same time as RawTabItem entries are parsed,
 * so the separation here is for convenience and clarity.
 */
export interface RawTabItemWithIds extends RawTabItem {
	tabId: string
	panelId: string
}

/**
 * TabItem includes all properties needed to render tabs,
 * which includes active state.
 */
export interface TabItem extends RawTabItemWithIds {
	isActive: boolean
}

type InheritedTabsProps = Pick<
	TabsProps,
	'ariaLabel' | 'ariaLabelledBy' | 'variant'
>

/**
 * TabControlsProps is used for both TabButtonControls & TabDropdownControls.
 * Those components are meant to be interchangeable, so they share
 * the same interface.
 */
export interface TabControlsProps extends InheritedTabsProps {
	tabItems: TabItem[]
	activeTabIndex: number
	setActiveTabIndex: (newActiveIndex: number) => void

	/**
	 * If true, nested tab styling will be applied to the component.
	 * Defaults to false.
	 */
	isNested?: boolean
}
