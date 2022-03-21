import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import s from './interactive-lab-button.module.css'

interface InteractiveLabButtonProps {
  showButton: boolean
}

export default function InteractiveLabButton({
  showButton,
}: InteractiveLabButtonProps) {
  if (!showButton) {
    return null
  }
  return (
    <button className={s.labButton}>
      <IconTerminalScreen16 className={s.terminalIcon} />
      <span>Show Terminal</span>
    </button>
  )
}
