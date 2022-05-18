import * as React from 'react'
import classNames from 'classnames'
import type { NotificationProps } from '../types'
import Button from '@hashicorp/react-button'
import CloseButton from '@hashicorp/react-close-button'
import s from '../style.module.css'

export default function Notification({
  appearance = 'light',
  description,
  onDismiss,
  cta,
  children,
}: NotificationProps & { children?: React.ReactNode }) {
  return (
    <div
      className={classNames(s.notification, s[appearance])}
      data-testid="notification"
    >
      <CloseButton
        appearance={appearance}
        onClick={onDismiss}
        ariaLabel="Dimiss notification"
        className={s.closeButton}
      />
      <div className={s.content}>
        {children}
        <p className={s.description}>{description}</p>
        <div className={s.cta}>
          <Button
            title={cta.title}
            url={cta.url}
            linkType="inbound"
            size="small"
            theme={{
              variant: appearance === 'dark' ? 'tertiary-neutral' : 'tertiary',
              background: appearance,
            }}
          />
        </div>
      </div>
    </div>
  )
}
