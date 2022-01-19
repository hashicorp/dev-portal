import classNames from 'classnames'
import { ParagraphProps } from './types'
import s from './paragraph.module.css'

const Paragraph: React.FC<ParagraphProps> = ({
  size = 300,
  weight = 'regular',
  ...rest
}) => {
  const className = classNames(
    s.paragraph,
    s[`display-${size}`],
    s[`weight-${weight}`],
    rest.className
  )
  const passableProps = {
    ...rest,
    className,
  }

  return <p {...passableProps} />
}

export type { ParagraphProps }
export default Paragraph
