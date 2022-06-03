import { ReactElement } from 'react'
import classNames from 'classnames'
import { IconMessageSquareFill24 } from '@hashicorp/flight-icons/svg-react/message-square-fill-24'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import ButtonLink from 'components/button-link'
import s from './give-feedback-button.module.css'

const FORM_URL = 'https://forms.gle/fnHLuNahLEhjuKvE6'
const LINK_TEXT = 'Give beta feedback'
const LINK_ARIA_LABEL = 'Give beta feedback (opens in new tab)'

function GiveFeedbackButton(): ReactElement {
  return (
    <>
      <span className={s.iconButtonContainer}>
        <a
          href={FORM_URL}
          aria-label={LINK_ARIA_LABEL}
          className={classNames(s.iconButton, s.primary)}
          target="_blank"
          rel="noreferrer"
        >
          <IconMessageSquareFill24 />
        </a>
      </span>
      <span className={s.textButtonContainer}>
        <ButtonLink
          openInNewTab={true}
          href={FORM_URL}
          text={LINK_TEXT}
          aria-label={LINK_ARIA_LABEL}
          icon={<IconExternalLink16 />}
          iconPosition="trailing"
        />
      </span>
    </>
  )
}

export default GiveFeedbackButton
