import { Fragment } from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import StandaloneLink from 'components/standalone-link'
import SkipToMainContent from 'components/sidebar/components/sidebar-nav/skip-to-main-content'
import { SidebarNavLink } from 'components/sidebar/components/sidebar-nav/sidebar-nav-menu-item'
import {
  ListItemProps,
  SectionListProps,
  SectionTitleProps,
  TutorialSidebarProps,
} from './types'
import s from './tutorials-sidebar.module.css'
import {
  SidebarHorizontalRule,
  SidebarSectionHeading,
  SidebarTitleHeading,
} from 'components/sidebar/components'

const NAV_LABEL_ID = 'TutorialsSidebar_label'

function TutorialsSidebar({
  backToLink,
  children,
  title,
  visuallyHideTitle,
}: TutorialSidebarProps) {
  // To visually hide the title, wrap in VisuallyHidden
  const TitleWrapper = visuallyHideTitle ? VisuallyHidden : Fragment
  return (
    <nav className={s.root} aria-labelledby={NAV_LABEL_ID}>
      <div className={s.backToLink}>
        <StandaloneLink
          href={backToLink.href}
          text={backToLink.text}
          icon={<IconChevronLeft16 />}
          iconPosition="leading"
          textSize={200}
        />
      </div>
      <div>
        <SkipToMainContent />
        <TitleWrapper>
          <SidebarTitleHeading text={title} id={NAV_LABEL_ID} />
        </TitleWrapper>
        {children}
      </div>
    </nav>
  )
}

function SectionList({ items }: SectionListProps) {
  return (
    <ul className={s.listRoot}>
      {items.map(({ text, href, isActive, isExternal }: ListItemProps) => {
        return (
          <ListItem
            key={`${text}${href}`}
            text={text}
            href={href}
            isActive={isActive}
            isExternal={isExternal}
          />
        )
      })}
    </ul>
  )
}

function ListItem({ href, isActive, text, isExternal }: ListItemProps) {
  const parsedIsExternal =
    typeof isExternal == 'boolean' ? isExternal : isAbsoluteUrl(href)
  const hrefOrFullPath = parsedIsExternal ? { href } : { fullPath: href }
  return <SidebarNavLink item={{ isActive, title: text, ...hrefOrFullPath }} />
}

function SectionTitle({ text }: SectionTitleProps) {
  return <SidebarSectionHeading text={text} />
}

function HorizontalRule() {
  return <SidebarHorizontalRule />
}

export { HorizontalRule, ListItem, SectionList, SectionTitle }
export default TutorialsSidebar
