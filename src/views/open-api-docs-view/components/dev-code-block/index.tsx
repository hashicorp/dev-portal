import { CSSProperties, ReactNode } from 'react'
import classNames from 'classnames'
import s from './dev-code-block.module.css'

export function DevCodeBlock({
	children,
	style,
	wrap = true,
	className,
}: {
	children: ReactNode
	wrap?: boolean
	className?: string
	style?: CSSProperties
}) {
	return (
		<pre
			className={classNames(className, s.pre, { [s.wrap]: wrap })}
			style={style}
		>
			<code>{children}</code>
		</pre>
	)
}
