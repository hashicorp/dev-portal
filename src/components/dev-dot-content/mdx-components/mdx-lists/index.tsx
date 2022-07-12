import { ReactNode } from 'react'
import s from './mdx-lists.module.css'

function MdxOrderedList({ children }: { children: ReactNode }) {
  return <ol className={s.listRoot}>{children}</ol>
}

function MdxUnorderedList({ children }: { children: ReactNode }) {
  return <ul className={s.listRoot}>{children}</ul>
}

function MdxListItem({ children }: { children: ReactNode }) {
  return <li className={s.listItem}>{children}</li>
}

export { MdxListItem, MdxOrderedList, MdxUnorderedList }
export default MdxListItem
