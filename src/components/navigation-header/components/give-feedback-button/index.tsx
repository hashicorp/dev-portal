import { ReactElement } from 'react'
import classNames from 'classnames'
import { IconMessageSquareFill24 } from '@hashicorp/flight-icons/svg-react/message-square-fill-24'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ButtonLink from 'components/button-link'
import { useDeviceSize } from 'contexts'
import s from './give-feedback-button.module.css'

const FORM_URL = 'https://forms.gle/fnHLuNahLEhjuKvE6'

function GiveFeedbackButton(): ReactElement {
  const { isMobile } = useDeviceSize()

  if (isMobile) {
    return (
      <a
        href={FORM_URL}
        aria-label="Give beta feedback"
        className={classNames(s.iconButton, s.primary)}
        target="_blank"
        rel="noreferrer"
      >
        <IconMessageSquareFill24 />
      </a>
    )
  } else {
    return (
      <ButtonLink
        openInNewTab={true}
        href={FORM_URL}
        text="Give beta feedback"
        icon={<IconExternalLink16 />}
        iconPosition="trailing"
      />
    )
  }
}

export default GiveFeedbackButton
