import { useInstruqtEmbed } from 'contexts/instruqt-lab'

interface InteractiveLabToggleProps {
  showButton: boolean
}

export function InteractiveLabToggle({
  showButton,
}: InteractiveLabToggleProps) {
  const ctx = useInstruqtEmbed()

  if (!showButton || !ctx.labId) {
    return null
  }
  return (
    <button onClick={() => ctx.setActive(!ctx.active)}>{`${
      ctx.active ? 'Hide' : 'Show'
    } Terminal`}</button>
  )
}
