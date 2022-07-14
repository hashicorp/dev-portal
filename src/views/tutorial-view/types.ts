import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { LearnProductData } from 'types/products'
import {
	Collection as ClientCollection,
	CollectionLite as ClientCollectionLite,
	TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import { CollectionCardPropsWithId } from 'components/collection-card'

interface TutorialViewProps {
	layoutProps: TutorialSidebarSidecarProps
	product: LearnProductData
	tutorial: TutorialData
}

interface TutorialData
	extends Pick<
		ClientTutorial,
		| 'name'
		| 'slug'
		| 'readTime'
		| 'productsUsed'
		| 'edition'
		| 'handsOnLab'
		| 'video'
	> {
	collectionCtx: CollectionContext
	content: MDXRemoteSerializeResult
	nextCollectionInSidebar?: ClientCollectionLite
}

type CollectionContext = {
	default: Pick<ClientCollection, 'slug' | 'id'>
	current: ClientCollection
	featuredIn?: CollectionCardPropsWithId[]
}

type TutorialSidebarSidecarProps = Required<
	Pick<
		SidebarSidecarLayoutProps,
		'children' | 'headings' | 'breadcrumbLinks'
	> & { sidebarSections: CollectionCategorySidebarSection[] }
>

export type {
	TutorialViewProps,
	TutorialData,
	CollectionContext,
	TutorialSidebarSidecarProps,
}
