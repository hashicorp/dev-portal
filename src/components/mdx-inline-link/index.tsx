import classNames from 'classnames'
import { AnchorHTMLAttributes } from 'react'
import s from './mdx-inline-link.module.css'

// styled anchor element for tutorial and docs content
export default function MdxInlineLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const passableProps = {
    ...props,
    className: classNames(props.className, s.anchor),
  }
  return <a {...passableProps}>{props.children}</a>
}
