import TutorialsSidebar, {
  SectionList,
  HorizontalRule,
  SectionTitle,
} from 'components/tutorials-sidebar'
import { LearnProductData } from 'types/products'
import { CollectionCategorySidebarSection } from '../helpers'

interface CollectionViewSidebarProps {
  product: LearnProductData
  sections: CollectionCategorySidebarSection[]
}

export default function CollectionViewSidebar({
  product,
  sections,
}: CollectionViewSidebarProps) {
  return (
    <TutorialsSidebar
      title={`${product.name} Tutorials`}
      backToLink={{
        text: `${product.name} Home`,
        href: `/${product.slug}`,
      }}
    >
      <SectionList
        items={[
          {
            text: 'Overview',
            href: `/${product.slug}/tutorials`,
            isActive: false,
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
