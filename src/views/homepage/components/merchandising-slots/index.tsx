import { Children } from 'react'
import s from './merchandising-slots.module.css'

export default function MerchandisingSlots({ children }) {
  const totalSlots = Children.count(children)
  if (totalSlots !== 4) {
    throw new Error(
      `MerchandisingSlots expects 4 children, but received ${totalSlots}`
    )
  }
  return (
    <section className={s.merchandisingSlots}>
      <div className={s.container}>{children}</div>
    </section>
  )
}
