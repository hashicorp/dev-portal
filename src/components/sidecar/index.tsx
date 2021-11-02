import s from './style.module.css'

export interface SidecarHeading {
  title: string
  slug: string
}

interface SidecarProps {
  headings: SidecarHeading[]
}

const Sidecar: React.FC<SidecarProps> = ({ headings }) => {
  console.log('headings', headings)
  return (
    <aside className={s.sidecar}>
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
