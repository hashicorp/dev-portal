/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VariantDropdownDisclosure } from 'views/tutorial-view/components'
import { useVariant } from 'views/tutorial-view/utils/variants/context'
import { DesktopVariantList } from './desktop'
import s from './variant-list.module.css'

export function VariantList({
	tutorialBasePath,
}: {
	tutorialBasePath: string
}) {
	const { currentVariant } = useVariant()

	if (!currentVariant) {
		return null
	}

	return (
		<>
			<div className={s.desktopVariantList} data-heap-track="variant-list">
				<DesktopVariantList
					variant={currentVariant}
					tutorialBasePath={tutorialBasePath}
				/>
			</div>
			<div className={s.mobileVariantDropdownDisclosure}>
				<VariantDropdownDisclosure
					isFullWidth
					variant={currentVariant}
					tutorialBasePath={tutorialBasePath}
				/>
			</div>
		</>
	)
}
