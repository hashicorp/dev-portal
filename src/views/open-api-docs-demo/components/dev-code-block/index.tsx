import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './dev-code-block.module.css'

export function DevCodeBlock({
	children,
	wrap = true,
	className,
}: {
	children: ReactNode
	wrap?: boolean
	className?: string
}) {
	return (
		<pre className={classNames(className, s.pre, { [s.wrap]: wrap })}>
			<code>{children}</code>
		</pre>
	)
}
