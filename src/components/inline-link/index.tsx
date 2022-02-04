import { ReactElement } from 'react'
import classNames from 'classnames'
import MaybeInternalLink from 'components/maybe-internal-link'
import s from './inline-link.module.css'
import Text, { TextProps } from 'components/text'

interface InlineLinkProps {
  className?: string
  href: string
  size: 100 | 200 | 300
  text: string
  weight?: TextProps['weight']
}

const InlineLink = ({
  className,
  href,
  size,
  text,
  weight,
}: InlineLinkProps): ReactElement => {
  const classes = classNames(s.root, className)

  return (
    <MaybeInternalLink className={classes} href={href}>
      <Text asElement="span" size={size} weight={weight}>
        {text}
      </Text>
    </MaybeInternalLink>
  )
}

export default InlineLink
