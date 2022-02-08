import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import Text from 'components/text'
import { StandaloneLinkProps } from './types'
import s from './standalone-link.module.css'

const StandaloneLink = ({
  className,
  color = 'primary',
  href,
  icon,
  iconPosition,
  text,
  textSize,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, s[`color-${color}`], className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      {iconPosition === 'leading' && icon}
      <Text asElement="span" className={s.text} size={textSize} weight="medium">
        {text}
      </Text>
      {iconPosition === 'trailing' && icon}
    </MaybeInternalLink>
  )
}

export type { StandaloneLinkProps }
export default StandaloneLink
