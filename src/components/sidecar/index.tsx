import classNames from 'classnames'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from './use-active-section'
import { SidecarHeading } from './types'
import s from './style.module.css'

interface SidecarProps {
  headings: SidecarHeading[]
}

// TODO: there are still a few things to do here. See https://app.asana.com/0/0/1201265683986463/f.
const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const { isDesktop } = useDeviceSize()
  const activeSection = useActiveSection(headings, isDesktop)

  return (
    <aside className={`${s.sidecar} hide-on-mobile hide-on-tablet`}>
      <p className={s.sidecarLabel} id="table-of-contents">
        On this page
      </p>
      <nav aria-labelledby="table-of-contents">
        <ol className={s.sidecarList}>
          {headings.map(({ slug, title }) => {
            const isActive = slug === activeSection
            return (
              <li
                className={classNames(s.sidecarListItem, {
                  [s['sidecarListItem-active']]: isActive,
                })}
                key={slug}
              >
                <a href={`#${slug}`}>{title}</a>
                {isActive && <span />}
              </li>
            )
          })}
        </ol>
      </nav>
    </aside>
  )
}

export default Sidecar
