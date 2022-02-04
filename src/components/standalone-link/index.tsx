import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import Text from 'components/text'
import { StandaloneLinkProps } from './types'
import s from './standalone-link.module.css'

const StandaloneLink = ({
  className,
  href,
  icon,
  iconPosition,
  text,
  textSize,
  textWeight,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      {iconPosition === 'leading' && icon}
      <Text asElement="span" size={textSize} weight={textWeight}>
        {text}
      </Text>
      {iconPosition === 'trailing' && icon}
    </MaybeInternalLink>
  )
}

export type { StandaloneLinkProps }
export default StandaloneLink
