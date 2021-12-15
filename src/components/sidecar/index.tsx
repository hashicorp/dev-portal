import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from './use-active-section'
import { SidecarHeading } from './types'
import s from './style.module.css'

interface SidecarProps {
  headings: SidecarHeading[]
}

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(headings, isDesktop)

  const renderListItem = ({ slug, title }) => {
    const isActive = slug === activeSection
    const className = classNames(s.sidecarListItem, {
      [s.activeSidecarListItem]: isActive,
    })

    return (
      <li className={className} key={slug}>
        <a href={`#${slug}`}>{title}</a>
        {isActive && <span className={s.activeIndicator} />}
      </li>
    )
  }

  return (
    <nav
      aria-labelledby="table-of-contents"
      className={`${s.sidecar} hide-on-mobile hide-on-tablet`}
    >
      <p className={s.sidecarLabel} id="table-of-contents">
        On this page
      </p>
      <ol className={s.sidecarList}>{headings.map(renderListItem)}</ol>
    </nav>
  )
}

export default Sidecar
