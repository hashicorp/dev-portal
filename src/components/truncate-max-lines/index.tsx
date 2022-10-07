import classNames from 'classnames'
import { TruncateMaxLinesProps } from './types'
import s from './truncate-max-lines.module.css'

function TruncateMaxLines({
	children,
	className,
	lineHeight,
	maxLines,
}: TruncateMaxLinesProps) {
	return (
		<span
			className={classNames(s.root, className)}
			style={
				{
					'--max-lines': maxLines,
					'--line-height': lineHeight,
				} as React.CSSProperties
			}
		>
			{children}
		</span>
	)
}

export default TruncateMaxLines
