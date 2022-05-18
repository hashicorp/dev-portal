import * as React from 'react'
import type { NotificationWithThumbnailProps } from '../types'
import Image from 'next/image'
import Notification from '../notification'
import s from '../style.module.css'

export default function NotificationWithThumbnail(
  props: NotificationWithThumbnailProps
) {
  const { thumbnail, ...rest } = props
  return (
    <Notification {...rest}>
      <div className={s.thumbnail}>
        <Image
          src={thumbnail.src}
          width={800}
          height={600}
          objectFit="cover"
          alt={thumbnail.alt}
        />
      </div>
    </Notification>
  )
}
