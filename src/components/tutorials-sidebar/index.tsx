import {
  SidebarHorizontalRule,
  SidebarSectionHeading,
  SidebarNavMenuItem,
} from 'components/sidebar/components'
import Sidebar from 'components/sidebar'
import {
  ListItemProps,
  SectionListProps,
  SectionTitleProps,
  TutorialSidebarProps,
} from './types'
import s from './tutorials-sidebar.module.css'

function TutorialsSidebar({
  backToLinkProps,
  children,
  levelButtonProps,
  title,
  visuallyHideTitle,
}: TutorialSidebarProps) {
  return (
    <Sidebar
      backToLinkProps={backToLinkProps}
      levelButtonProps={levelButtonProps}
      showFilterInput={false}
      title={title}
      visuallyHideTitle={visuallyHideTitle}
    >
      {children}
    </Sidebar>
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
