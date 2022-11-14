import classNames from 'classnames'
import s from './mdx-inline-code.module.css'

function MdxInlineCode({ className, ...restProps }) {
	return <code {...restProps} className={classNames(s.inlineCode, className)} />
}

export { MdxInlineCode }
