import { Fragment } from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import SidebarBackToLink from 'components/sidebar/components/sidebar-back-to-link'
import {
  SidebarHorizontalRule,
  SidebarSectionHeading,
  SidebarSkipToMainContent,
  SidebarTitleHeading,
  SidebarNavMenuItem,
} from 'components/sidebar/components'
import {
  ListItemProps,
  SectionListProps,
  SectionTitleProps,
  TutorialSidebarProps,
} from './types'
import s from './tutorials-sidebar.module.css'

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
    <nav aria-labelledby={NAV_LABEL_ID}>
      <SidebarBackToLink text={backToLink.text} url={backToLink.href} />
      <div className={s.itemsContainer}>
        <SidebarSkipToMainContent />
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
      {items.map(({ text, href, isActive }: ListItemProps) => {
        return (
          <ListItem
            key={`${text}${href}`}
            text={text}
            href={href}
            isActive={isActive}
          />
        )
      })}
    </ul>
  )
}

function ListItem({ href, isActive, text }: ListItemProps) {
  return <SidebarNavMenuItem item={{ isActive, title: text, href }} />
}

function SectionTitle({ text }: SectionTitleProps) {
  return <SidebarSectionHeading text={text} />
}

function HorizontalRule() {
  return <SidebarHorizontalRule />
}

export { HorizontalRule, ListItem, SectionList, SectionTitle }
export default TutorialsSidebar
