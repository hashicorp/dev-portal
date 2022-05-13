import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import Button, { ButtonProps } from 'components/button'
import { SidebarProps } from 'components/sidebar/types'
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

interface SidebarMobileControlsProps {
  levelUpButtonText: ButtonProps['text']
  levelDownButtonText: ButtonProps['text']
  setCurrentSidebarLevel: SidebarProps['setCurrentSidebarLevel']
}

/**
 * Handles rendering either one or both of `LevelUpButton` and
 * `LevelDownButton`. It determines what to render by consuming data from
 * `SidebarNavDataContext` using the `useSidebarNavData` hook.
 */
const SidebarMobileControls = ({
  levelUpButtonText,
  levelDownButtonText,
  setCurrentSidebarLevel,
}: SidebarMobileControlsProps) => {
  let levelUpButton
  if (levelUpButtonText) {
    levelUpButton = (
      <LevelUpButton
        text={levelUpButtonText}
        onClick={() =>
          setCurrentSidebarLevel((prevLevel: number) => prevLevel - 1)
        }
      />
    )
  }

  let levelDownButton
  if (levelDownButtonText) {
    levelDownButton = (
      <LevelDownButton
        text={levelDownButtonText}
        onClick={() =>
          setCurrentSidebarLevel((prevLevel: number) => prevLevel + 1)
        }
      />
    )
  }

  return (
    <div className={s.root}>
      {levelUpButton}
      {levelDownButton}
    </div>
  )
}

export type { SidebarMobileControlsProps }
export default SidebarMobileControls
