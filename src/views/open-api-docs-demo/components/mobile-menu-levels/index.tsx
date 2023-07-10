import { useState, ReactNode } from 'react'
// Icons
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
// Components
import Button from 'components/button'
import MobileMenuContainer from 'components/mobile-menu-container'
import { MobileAuthenticationControls } from 'components/mobile-menu-container'
// Styles
import s from './mobile-menu-levels.module.css'

interface MobileMenuLevelData {
	heading: string
	content: ReactNode
}

/**
 * TODO: this is a total stopgap, just trying to get
 * something workable for mobile menu prototyping.
 *
 * Intent is to solidify this into an alternative pattern
 * for composing mobile menu contents later.
 */
export function MobileMenuLevels({
	levels,
}: {
	levels: MobileMenuLevelData[]
}) {
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
						text={levels[currentLevel - 1].heading}
					/>
				) : null}
				{currentLevel < levels.length - 1 ? (
					<Button
						className={s.levelDownButton}
						color="tertiary"
						icon={<IconChevronRight16 />}
						iconPosition="trailing"
						onClick={() => setCurrentLevel(currentLevel + 1)}
						text={levels[currentLevel + 1].heading}
					/>
				) : null}
			</div>
			{levels[currentLevel].content}
		</MobileMenuContainer>
	)
}
