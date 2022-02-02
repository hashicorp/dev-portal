import { useMemo } from 'react'
import classNames from 'classnames'
import { SidecarHeading } from './types'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from './use-active-section'
import getTruncatedTitle from './utils/get-truncated-title'
import s from './style.module.css'

interface SidecarProps {
  headings: SidecarHeading[]
}

const SIDECAR_LABEL_ELEMENT_ID = 'sidecar-label'

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const level1And2Headings = useMemo(
    () => headings.filter((heading) => heading.level <= 2),
    [headings]
  )
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(level1And2Headings, isDesktop)

  const renderListItem = ({ slug, title }) => {
    const isActive = slug === activeSection
    const className = classNames(s.sidecarListItem, {
      [s.activeSidecarListItem]: isActive,
    })
    const truncatedTitle = getTruncatedTitle(title)

    return (
      <li className={className} key={slug}>
        <a className={s.sidecarListItemAnchor} href={`#${slug}`}>
          {truncatedTitle}
        </a>
        {isActive && <span aria-hidden className={s.activeIndicator} />}
      </li>
    )
  }

  return (
    <nav aria-labelledby={SIDECAR_LABEL_ELEMENT_ID} className={s.sidecar}>
      <p className={s.sidecarLabel} id={SIDECAR_LABEL_ELEMENT_ID}>
        On this page
      </p>
      <ol className={s.sidecarList}>
        {level1And2Headings.map(renderListItem)}
      </ol>
    </nav>
  )
}

export default Sidecar
