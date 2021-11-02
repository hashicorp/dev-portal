import { useLayoutEffect, useState } from 'react'
import NavigationHeader from 'components/navigation-header'
import Sidebar, { MenuItem } from 'components/sidebar'
import Sidecar, { SidecarHeading } from 'components/sidecar'
import s from './docs-layout.module.css'

interface DocsLayoutProps {
  children: React.ReactNode
  navData: MenuItem[]
}

const DocsLayout: React.FC<DocsLayoutProps> = (props) => {
  const [tableOfContentsHeadings, setTableOfContentsHeadings] = useState<
    SidecarHeading[]
  >([])

  // TODO: use new remark plugin instead (ref: https://app.asana.com/0/1100423001970639/1201314477034614/f)
  useLayoutEffect(() => {
    const headingElements = document
      .querySelector('main')
      .querySelectorAll('h1,h2,h3,h4,h5,h6')

    const headings = []
    headingElements.forEach((heading) => {
      const slug = heading.querySelectorAll('a')[1].id
      const title = heading.textContent.substring(1)
      headings.push({ slug, title })
    })

    setTableOfContentsHeadings(headings)
  }, [])

  return (
    <div className={s.container}>
      <NavigationHeader />
      <div className={s.body}>
        <Sidebar menuItems={props.navData} />
        <div className={s.contentWrapper}>
          <div className={s.content}>
            {/* TODO: implement version switcher */}
            {/* <div className={s.versionSwitcher}>VERSION SWITCHER</div> */}
            <main className={s.main}>{props.children}</main>
            <Sidecar headings={tableOfContentsHeadings} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocsLayout
