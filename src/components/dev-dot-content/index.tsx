import { FC } from 'react'
import s from './dev-dot-content.module.css'

const DevDotContent: FC = ({ children }) => {
  return <div className={s.root}>{children}</div>
}

export default DevDotContent
