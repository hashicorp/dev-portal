import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './interactive-lab-button.module.css'

// @TODO replace with Button component once implemented

export default function InteractiveLabButton() {
  const ctx = useInstruqtEmbed()

  if (!ctx.labId) {
    return null
  }

  const buttonText = `${ctx.active ? 'Hide' : 'Show'} Terminal`

  return (
    <button className={s.labButton} onClick={() => ctx.setActive(!ctx.active)}>
      <IconTerminalScreen16 className={s.terminalIcon} />
      <span>{buttonText}</span>
    </button>
  )
}
