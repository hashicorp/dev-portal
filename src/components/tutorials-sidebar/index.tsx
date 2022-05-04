import { useCurrentProduct } from 'contexts'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
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
  const currentProduct = useCurrentProduct()

  return (
    <Sidebar
      backToLinkProps={backToLinkProps}
      levelButtonProps={levelButtonProps}
      overviewItemHref={`/${currentProduct.slug}/tutorials`}
      showFilterInput={false}
      title={title}
      visuallyHideTitle={visuallyHideTitle}
    >
      {children}
    </Sidebar>
  )
}

function CollectionViewSidebarContent({
  sections,
}: {
  sections: CollectionCategorySidebarSection[]
}) {
  return (
    <>
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
  CollectionViewSidebarContent,
  HorizontalRule,
  ListItem,
  SectionList,
  SectionTitle,
}
export default TutorialsSidebar
