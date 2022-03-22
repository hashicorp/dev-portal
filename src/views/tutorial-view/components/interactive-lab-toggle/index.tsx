import { useInstruqtEmbed } from 'contexts/instruqt-lab'

export function InteractiveLabToggle() {
  const ctx = useInstruqtEmbed()

  if (!ctx.labId) {
    return null
  }

  const buttonText = `${ctx.active ? 'Hide' : 'Show'} Terminal`

  return (
    <button onClick={() => ctx.setActive(!ctx.active)}>{buttonText}</button>
  )
}
