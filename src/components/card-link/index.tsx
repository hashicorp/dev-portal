import { FC } from 'react'
import Card from 'components/card'
import s from './card-link.module.css'

const CardLink: FC = ({ children }) => {
  return <Card className={s.root}>{children}</Card>
}

export default CardLink
