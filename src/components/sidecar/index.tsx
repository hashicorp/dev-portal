import { useLayoutEffect, useState } from 'react'
import classNames from 'classnames'
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
  const [activeSectionSlug, setActiveSectionSlug] = useState<string>()

  // WIP: still modeling off of https://github.com/hashicorp/react-components/pull/325/files#diff-fb77bef81abf88c4e046f0ab25dfb955d3138b579b67143bad7124d5bcb04f6d
  useLayoutEffect(() => {
    if (isMobile || isTablet) {
      return
    }

    const handleIntersection = (entries) => {
      const visibleHeadingIds = []

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleHeadingIds.push(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection)
    headings.forEach((heading) => {
      const headingLink = document.querySelector(`#${heading.slug}`)
      if (headingLink) {
        observer.observe(headingLink)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const headingLink = document.querySelector(`#${heading.slug}`)
        if (headingLink) {
          observer.unobserve(headingLink)
        }
      })
    }
  }, [headings, isMobile, isTablet])

  return (
    <aside className={`${s.sidecar} hide-on-mobile hide-on-tablet`}>
      <p className={s.sidecarLabel} id="table-of-contents">
        On this page
      </p>
      <nav aria-labelledby="table-of-contents">
        <ol className={s.sidecarList}>
          {headings.map(({ slug, title }) => {
            const isActive = slug === activeSectionSlug
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
