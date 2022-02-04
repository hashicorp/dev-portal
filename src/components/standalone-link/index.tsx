import { ReactElement } from 'react'
import MaybeInternalLink from 'components/maybe-internal-link'
import s from './standalone-link.module.css'
import Text, { TextProps } from 'components/text'
import classNames from 'classnames'

interface StandaloneLinkProps {
  className?: string
  href: string
  icon: ReactElement
  iconPosition: 'leading' | 'trailing'
  size: TextProps['size']
  text: string
  weight: TextProps['weight']
}

const StandaloneLink = ({
  className,
  href,
  icon,
  iconPosition,
  size,
  text,
  weight,
}: StandaloneLinkProps): ReactElement => {
  const classes = classNames(s.root, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      {iconPosition === 'leading' && icon}
      <Text asElement="span" size={size} weight={weight}>
        {text}
      </Text>
      {iconPosition === 'trailing' && icon}
    </MaybeInternalLink>
  )
}

export default StandaloneLink
