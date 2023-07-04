import { ReactNode } from 'react'
import classNames from 'classnames'
import s from './dev-code-block.module.css'

export function DevCodeBlock({
	children,
	wrap = true,
}: {
	children: ReactNode
	wrap?: boolean
}) {
	return (
		<pre className={classNames(s.pre, { [s.wrap]: wrap })}>
			<code>{children}</code>
		</pre>
	)
}
