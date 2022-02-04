import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import Text from 'components/text'
import { InlineLinkProps } from './types'
import s from './inline-link.module.css'

const InlineLink = ({
  className,
  href,
  text,
  textSize,
  textWeight,
}: InlineLinkProps): ReactElement => {
  const classes = classNames(s.root, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      <Text asElement="span" size={textSize} weight={textWeight}>
        {text}
      </Text>
    </MaybeInternalLink>
  )
}

export type { InlineLinkProps }
export default InlineLink
