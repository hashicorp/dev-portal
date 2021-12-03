import { useDeviceSize } from 'contexts'
import s from './style.module.css'

export interface SidecarHeading {
  title: string
  slug: string
}

interface SidecarProps {
  headings: SidecarHeading[]
}

// TODO: there are still a few things to do here. See https://app.asana.com/0/0/1201265683986463/f.
const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  const { isMobile, isTablet } = useDeviceSize()
  console.log('mobile?', isMobile, 'tablet?', isTablet)

  return (
    <aside className={`${s.sidecar} hide-on-mobile hide-on-tablet`}>
      <p className={s.sidecarLabel} id="table-of-contents">
        On this page
      </p>
      <nav aria-labelledby="table-of-contents">
        <ol className={s.sidecarList}>
          {headings.map(({ slug, title }) => (
            <li className={s.sidecarListItem} key={slug}>
              <a href={`#${slug}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

export default Sidecar
