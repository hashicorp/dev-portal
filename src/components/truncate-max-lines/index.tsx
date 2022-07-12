import s from './truncate-max-lines.module.css'
import { TruncateMaxLinesProps } from './types'

function TruncateMaxLines({
  children,
  maxLines,
  lineHeight,
}: TruncateMaxLinesProps) {
  return (
    <span
      className={s.root}
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
