import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Button from 'components/button'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'

/**@TODO this button shows a drop-shadow elevation in the design,
 * adjust button to support or chat with design
 * */

export default function InteractiveLabButton() {
  const ctx = useInstruqtEmbed()

  if (!ctx.labId) {
    return null
  }

  const buttonText = `${ctx.active ? 'Hide' : 'Show'} Terminal`

  return (
    <Button
      color="primary"
      text={buttonText}
      onClick={() => ctx.setActive(!ctx.active)}
      size="medium"
      iconPosition="leading"
      icon={<IconTerminalScreen16 />}
    />
  )
}
