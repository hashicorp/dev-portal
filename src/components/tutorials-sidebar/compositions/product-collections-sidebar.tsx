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
    </TutorialsSidebar>
  )
}
