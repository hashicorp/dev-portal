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
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'

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

function TutorialsSidebarContent({
  sections,
}: {
  sections: CollectionCategorySidebarSection[]
}) {
  const currentProduct = useCurrentProduct()
  const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

  return (
    <>
      <SectionList
        items={[
          {
            text: 'Overview',
            href: `/${currentProduct.slug}/tutorials`,
            isActive: currentPath === `/${currentProduct.slug}/tutorials`,
          },
        ]}
      />
      {sections?.map((section: CollectionCategorySidebarSection) => {
        return (
          <>
            <HorizontalRule />
            <SectionTitle text={section.title} />
            <SectionList items={section.items} />
          </>
        )
      })}
      <HorizontalRule />
      <SectionTitle text="Resources" />
      <SectionList
        items={[
          {
            text: 'All Tutorials',
            href: 'https://learn.hashicorp.com',
          },
          {
            text: 'Community Forum',
            href: 'https://discuss.hashicorp.com',
          },
          { text: 'Support', href: 'https://support.hashicorp.com' },
          { text: 'GitHub', href: 'http://github.com/hashicorp' },
        ]}
      />
    </>
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

export {
  HorizontalRule,
  ListItem,
  SectionList,
  SectionTitle,
  TutorialsSidebarContent,
}
export default TutorialsSidebar
