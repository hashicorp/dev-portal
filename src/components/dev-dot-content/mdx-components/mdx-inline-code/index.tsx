import classNames from 'classnames'
import s from './mdx-inline-code.module.css'

export type MdxInlineCodeProps = {
	/** Optionally add a `className` to the `<code />` element. */
	className?: string
	/** Optionally set the code style size to use. Defaults to `200`. */
	size?: 100 | 200
} & JSX.IntrinsicElements['code']

function MdxInlineCode({
	className,
	size = 200,
	...restProps
}: MdxInlineCodeProps) {
	return (
		<code
			{...restProps}
			className={classNames(s.inlineCode, s[`size-${size}`], className)}
		/>
	)
}

export { MdxInlineCode }
