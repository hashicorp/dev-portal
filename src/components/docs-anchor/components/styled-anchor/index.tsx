import classNames from 'classnames'
import { AnchorHTMLAttributes } from 'react'
import s from './styled-anchor.module.css'

export default function StyledAnchor(
  props: AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const passableProps = {
    ...props,
    className: classNames(props.className, s.anchor),
  }
  return <a {...passableProps}>{props.children}</a>
}
