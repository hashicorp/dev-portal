import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import { IconChevronRight16 } from '@hashicorp/flight-icons/svg-react/chevron-right-16'
import Button, { ButtonProps } from 'components/button'
import { SidebarProps } from 'components/sidebar/types'
import { useSidebarNavData } from 'layouts/sidebar-sidecar/contexts/sidebar-nav-data'
import s from './sidebar-mobile-controls.module.css'

const BaseButton = ({
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

const BackButton = ({ onClick, text }: ButtonProps) => {
  return (
    <BaseButton
      className={s.backButton}
      icon={<IconChevronLeft16 />}
      iconPosition="leading"
      onClick={onClick}
      text={text}
    />
  )
}

const ForwardButton = ({ onClick, text }: ButtonProps) => {
  return (
    <BaseButton
      className={s.forwardButton}
      icon={<IconChevronRight16 />}
      iconPosition="trailing"
      onClick={onClick}
      text={text}
    />
  )
}

const SidebarMobileControls = ({
  levelButtonProps,
}: Pick<SidebarProps, 'levelButtonProps'>) => {
  const { hasManyLevels, isFirstLevel, isLastLevel, setCurrentLevel } =
    useSidebarNavData()
  const { text } = levelButtonProps

  let backButton
  if (hasManyLevels && !isFirstLevel) {
    backButton = (
      <BackButton
        text={text}
        onClick={() => setCurrentLevel((prevLevel: number) => prevLevel - 1)}
      />
    )
  }

  let forwardButton
  if (hasManyLevels && !isLastLevel) {
    forwardButton = (
      <ForwardButton
        text={isFirstLevel ? text : 'Previous'}
        onClick={() => setCurrentLevel((prevLevel: number) => prevLevel + 1)}
      />
    )
  }

  // TODO
  return (
    <div className={s.root}>
      {backButton}
      {forwardButton}
    </div>
  )
}

export default SidebarMobileControls
