import * as React from 'react'
import type { NotificationTypes, NotificationWithResourceProps } from '../types'
import Notification from '../notification'
import { IconRadio16 } from '@hashicorp/flight-icons/svg-react/radio-16'
import { IconCalendar16 } from '@hashicorp/flight-icons/svg-react/calendar-16'
import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import s from '../style.module.css'

const TYPE_MAP: {
  [key in NotificationTypes]: {
    name: string
    icon: React.ReactNode
  }
} = {
  podcast: {
    name: 'Podcast',
    icon: <IconRadio16 />,
  },
  webinar: {
    name: 'Webinar',
    icon: <IconCalendar16 />,
  },
  whitepaper: {
    name: 'Whitepaper',
    icon: <IconGuide16 />,
  },
}

export default function NotificationWithResource(
  props: NotificationWithResourceProps
) {
  const { type, ...rest } = props
  return (
    <Notification {...rest}>
      <div className={s.type}>
        <span className={s.typeIcon}>{TYPE_MAP[type].icon}</span>
        <span className={s.typeName}>{TYPE_MAP[type].name}</span>
      </div>
    </Notification>
  )
}
