import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from './use-active-section'
import { SidecarHeading } from './types'
import s from './style.module.css'
import getTruncatedTitle from './utils/get-truncated-title'

interface SidecarProps {
  headings: SidecarHeading[]
}

const SIDECAR_LABEL_ELEMENT_ID = 'sidecar-label'

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(headings, isDesktop)

  const renderListItem = ({ level, slug, title }) => {
    if (level > 2) {
      return null
    }

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
      <ol className={s.sidecarList}>{headings.map(renderListItem)}</ol>
    </nav>
  )
}

export default Sidecar
