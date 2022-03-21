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
  return <button className={s.labButton}>Show Terminal</button>
}
