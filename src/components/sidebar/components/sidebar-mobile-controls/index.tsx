import classNames from 'classnames'
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import Button, { ButtonProps } from 'components/button'
import s from './sidebar-mobile-controls.module.css'

/**
 * The base `Button` component used by both `LevelUpButton` and
 * `LevelDownButton`. Handles setting the `Button` props that are the same for
 * both buttons.
 */
const BaseControlButton = ({
	className,
	icon,
	iconPosition,
	onClick,
	text,
}: ButtonProps) => {
	return (
		<Button
			className={className}
			color="tertiary"
			icon={icon}
			iconPosition={iconPosition}
			onClick={onClick}
			text={text}
		/>
	)
}

/**
 * The `Button` that handles moving the user "up" one nav data level in
 * `Sidebar`.
 *
 * Notes:
 *  - Always has a leading chevron-left icon.
 *  - Always displays on the lefthand side of the `Sidebar`.
 */
const LevelUpButton = ({ onClick, text }: ButtonProps) => {
	return (
		<BaseControlButton
			className={s.levelUpButton}
			icon={<IconChevronLeft16 />}
			iconPosition="leading"
			onClick={onClick}
			text={text}
		/>
	)
}
/**
 * The `Button` that handles moving the user "down" one nav data level in
 * `Sidebar`.
 *
 * Notes:
 *  - Always has a trailing chevron-right icon.
 *  - If rendered with `LevelUpButton`, displays on the righthand side of the
 *    `Sidebar`.
 *  - If rendered alone, displays on the lefthand side of the `Sidebar`.
 */
const LevelDownButton = ({ onClick, text }: ButtonProps) => {
	return (
		<BaseControlButton
			className={s.levelDownButton}
			icon={<IconChevronRight16 />}
			iconPosition="trailing"
			onClick={onClick}
			text={text}
		/>
	)
}

/**
 * One or both of `levelUp` and `levelDown`
 * `ButtonText` properties must be provided.
 */
type SidebarMobileControlsProps =
	| {
			levelUpButtonText?: ButtonProps['text']
			levelDownButtonText: ButtonProps['text']
	  }
	| {
			levelUpButtonText: ButtonProps['text']
			levelDownButtonText?: ButtonProps['text']
	  }

/**
 * Handles rendering either one or both of `LevelUpButton` and
 * `LevelDownButton`. It determines what to render by consuming data from
 * `SidebarNavDataContext` using the `useSidebarNavData` hook.
 */
const SidebarMobileControls = ({
	levelUpButtonText,
	levelDownButtonText,
}: SidebarMobileControlsProps) => {
	const { hasManyLevels, isFirstLevel, isLastLevel, setCurrentLevel } =
		useSidebarNavData()

	// Show `LevelUpButton` on all levels but the first one
	let levelUpButton
	if (hasManyLevels && !isFirstLevel) {
		levelUpButton = (
			<LevelUpButton
				text={levelUpButtonText}
				onClick={() => setCurrentLevel((prevLevel: number) => prevLevel - 1)}
			/>
		)
	}

	// Show `LevelDownButton` on all levels but the last one
	let levelDownButton
	if (hasManyLevels && !isLastLevel) {
		levelDownButton = (
			<LevelDownButton
				text={levelDownButtonText}
				onClick={() => setCurrentLevel((prevLevel: number) => prevLevel + 1)}
			/>
		)
	}

	const atTopLevel = !levelUpButton && !!levelDownButton
	return (
		<div className={classNames(s.root, { [s.rightAlign]: atTopLevel })}>
			{levelUpButton}
			{levelDownButton}
		</div>
	)
}

export type { SidebarMobileControlsProps }
export default SidebarMobileControls
