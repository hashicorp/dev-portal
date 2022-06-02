import { ReactElement } from 'react'
import { IconMessageSquareFill16 } from '@hashicorp/flight-icons/svg-react/message-square-fill-16'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ButtonLink from 'components/button-link'
import { useDeviceSize } from 'contexts'

function GiveFeedbackButton(): ReactElement {
  const { isMobile } = useDeviceSize()

  return (
    <ButtonLink
      href="https://forms.gle/fnHLuNahLEhjuKvE6"
      ariaLabel={'Give beta feedback'}
      text={isMobile ? undefined : 'Give beta feedback'}
      icon={isMobile ? <IconMessageSquareFill16 /> : <IconExternalLink16 />}
      iconPosition="trailing"
    />
  )
}

export default GiveFeedbackButton
