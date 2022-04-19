import { LearnProductData } from 'types/products'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import TutorialsSidebar, {
  SectionList,
  HorizontalRule,
  SectionTitle,
} from '../'

export interface ProductCollectionsSidebarProps {
  product: Pick<LearnProductData, 'name' | 'slug'>
  sections: CollectionCategorySidebarSection[]
  isOverview?: boolean
}

export default function ProductCollectionsSidebar({
  product,
  sections,
  isOverview = false,
}: ProductCollectionsSidebarProps) {
  return (
    <TutorialsSidebar
      title="Tutorials"
      backToLinkProps={{
        text: `${product.name} Home`,
        href: `/${product.slug}`,
      }}
    >
      <SectionList
        items={[
          {
            text: 'Overview',
            href: `/${product.slug}/tutorials`,
            isActive: isOverview,
          },
        ]}
      />
      {sections.map((section: CollectionCategorySidebarSection) => {
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
    </TutorialsSidebar>
  )
}
