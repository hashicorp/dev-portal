import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import Text from 'components/text'
import s from './page-alert.module.css'

interface PageAlertProps {
  className?: string
  description: ReactNode
  type?: 'neutral' | 'highlight' | 'success' | 'warning' | 'critical'
  icon: ReactElement
  title?: string
}

/**
 * Future TODO
 *  - Abstract subcomponents of Alert (container, title, description, etc.)
 *  - Support an optional `dismissible` prop
 *  - Support actions; possible combinations:
 *    - Single "secondary" Button
 *    - Single StandaloneLink
 *    - One "secondary" Button and one StandaloneLink
 */
const PageAlert = ({
  className,
  type = 'neutral',
  description,
  icon,
  title,
}: PageAlertProps) => {
  const classes = classNames(s.root, s[type], className)

  let titleElement
  if (title) {
    titleElement = (
      <Text asElement="p" className={s.title} size={200} weight="semibold">
        {title}
      </Text>
    )
  }

  return (
    <div className={classes}>
      <div className={s.icon}>{icon}</div>
      <div className={s.contentContainer}>
        {titleElement}
        <Text
          asElement="p"
          className={s.description}
          size={200}
          weight="regular"
        >
          {description}
        </Text>
      </div>
    </div>
  )
}

export default PageAlert
