import { useMemo } from 'react'
import { SidecarHeading } from './types'
import s from './style.module.css'
import TableOfContents from 'components/table-of-contents'

interface SidecarProps {
  headings: SidecarHeading[]
}

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const level1And2Headings = useMemo(
    () => headings.filter((heading) => heading.level <= 2),
    [headings]
  )

  return <TableOfContents className={s.sidecar} headings={level1And2Headings} />
}

export default Sidecar
