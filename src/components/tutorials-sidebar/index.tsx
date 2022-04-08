import { IconChevronLeft16 } from '@hashicorp/flight-icons/svg-react/chevron-left-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import StandaloneLink from 'components/standalone-link'
import { SkipToMainContent } from 'components/sidebar/components/sidebar-nav'
import { SidebarNavLink } from 'components/sidebar/components/sidebar-nav/sidebar-nav-menu-item'
import {
  ListItemProps,
  SectionListProps,
  SectionTitleProps,
  TutorialSidebarProps,
} from './types'
import s from './tutorials-sidebar.module.css'

function TutorialsSidebar({
  backToLink,
  children,
  ariaLabel,
}: TutorialSidebarProps) {
  return (
    <nav aria-label={ariaLabel} className={s.root}>
      <SkipToMainContent />
      <StandaloneLink
        className={s.backToLink}
        href={backToLink.href}
        text={backToLink.text}
        icon={<IconChevronLeft16 />}
        iconPosition="leading"
        textSize={200}
      />
      <div className={s.itemsContainer}>{children}</div>
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

function SectionTitle({ text, as = 'h2' }: SectionTitleProps) {
  const Elem = as
  return <Elem className={s.sectionTitle}>{text}</Elem>
}

function HorizontalRule() {
  return <hr className={s.hr} />
}

export { HorizontalRule, ListItem, SectionList, SectionTitle }
export default TutorialsSidebar
