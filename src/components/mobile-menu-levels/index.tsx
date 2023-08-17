/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState } from 'react'
// Icons
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
// Components
import Button from 'components/button'
import MobileMenuContainer from 'components/mobile-menu-container'
import { MobileAuthenticationControls } from 'components/mobile-menu-container'
// Types
import type { MobileMenuLevelData } from './types'
// Styles
import s from './mobile-menu-levels.module.css'

/**
 * This component allows the consumer to render a multi-pane mobile
 * menu without being required to use `SidebarSidecarLayout`
 * or the associated `sidebar-nav-data` React context.
 *
 * Intent is to solidify this into an alternative pattern
 * for composing mobile menu contents.
 */
function MobileMenuLevels({ levels }: { levels: MobileMenuLevelData[] }) {
	const [currentLevel, setCurrentLevel] = useState(levels.length - 1)

	return (
		<MobileMenuContainer className={s.mobileMenuContainer}>
			<MobileAuthenticationControls />
			<div className={s.levelButtons}>
				{currentLevel > 0 ? (
					<Button
						className={s.levelUpButton}
						color="tertiary"
						icon={<IconChevronLeft16 />}
						iconPosition="leading"
						onClick={() => setCurrentLevel(currentLevel - 1)}
						text={levels[currentLevel - 1].levelButtonText}
					/>
				) : null}
				{currentLevel < levels.length - 1 ? (
					<Button
						className={s.levelDownButton}
						color="tertiary"
						icon={<IconChevronRight16 />}
						iconPosition="trailing"
						onClick={() => setCurrentLevel(currentLevel + 1)}
						text={levels[currentLevel + 1].levelButtonText}
					/>
				) : null}
			</div>
			{levels[currentLevel].content}
		</MobileMenuContainer>
	)
}

export default MobileMenuLevels
