/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ChangeEventHandler, ReactElement, useState } from 'react'
import { IconChevronDown16 } from '@hashicorp/flight-icons/svg-react/chevron-down-16'
import { useCurrentProduct } from 'contexts'
import { ContextSwitcherOption, VersionContextSwitcherProps } from './types'
import s from './version-context-switcher.module.css'

/**
 * To be used as control that changes the content of a page or as form control.
 * This component should not be used for page navigation because it does not
 * have the semantics for doing so.
 *
 * TODO: this will eventually render a ContextSwitcher, it just hasn't been
 * built yet for the sake of time and because the component is also a WIP on the
 * design systems side.
 */

const VersionContextSwitcher = ({
	initialValue,
	onChange,
	options,
}: VersionContextSwitcherProps): ReactElement => {
	const currentProduct = useCurrentProduct()
	let latestVersion = options[0].value
	/** Update `latestVersion` to the latest version of the product
	 * that has been released if it can be determined. This is needed
	 * because not all products have `latest` listed as the first item
	 * in the sorted array. E.g. `vault-enterprise` lists `+ent.hsm.fips1402`
	 * variants first.
	 */
	for (let i = 0; i < options.length; i++) {
		const versionLabel = options[i].label
		const versionValue = options[i].value
		if (versionLabel.indexOf('(latest)') >= 0) {
			latestVersion = versionValue
			break
		}
	}

	const [selectedVersion, setSelectedVersion] = useState<
		ContextSwitcherOption['value']
	>(initialValue || latestVersion)

	/**
	 * Handle change event for switcher, invoking the `onChange` function last if
	 * it has been passed in the `onChange` prop.
	 */
	const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setSelectedVersion(e.target.value)

		if (onChange) {
			onChange(e)
		}
	}

	return (
		<div className={s.root}>
			<select
				aria-label="Choose a different version to install"
				className={s.select}
				onChange={handleChange}
				value={selectedVersion}
			>
				{options.map((option: HTMLOptionElement) => (
					<option
						aria-label={`${currentProduct.name} ${option.label}`}
						className={s.option}
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
			<IconChevronDown16 className={s.trailingIcon} />
		</div>
	)
}

export type { ContextSwitcherOption, VersionContextSwitcherProps }
export default VersionContextSwitcher
