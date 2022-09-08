import { Dispatch, ReactNode, SetStateAction } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { LearnProductData } from 'types/products'
import {
	Collection as ClientCollection,
	CollectionLite as ClientCollectionLite,
	Product as LearnClientProduct,
	TutorialFullCollectionCtx as ClientTutorial,
} from 'lib/learn-client/types'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import { CollectionCardPropsWithId } from 'components/collection-card'

type TutorialSidebarSidecarProps = Required<
	Pick<
		SidebarSidecarLayoutProps,
		'children' | 'headings' | 'breadcrumbLinks'
	> & { sidebarSections: CollectionCategorySidebarSection[] }
>

type CollectionContext = {
	default: Pick<ClientCollection, 'slug' | 'id'>
	current: ClientCollection
	featuredIn?: CollectionCardPropsWithId[]
}

interface TutorialData
	extends Pick<
		ClientTutorial,
		| 'id'
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
interface TutorialViewProps {
	layoutProps: TutorialSidebarSidecarProps
	product: Omit<LearnProductData, 'slug'> & {
		slug: LearnClientProduct['slug'] | 'hcp'
	} // @TODO clean up the hcp / learn product slug types https://app.asana.com/0/1202097197789424/1202946807363608
	tutorial: TutorialData
}

interface LayoutContentWrapperProps {
	children: ReactNode
	collectionCtx: TutorialData['collectionCtx']
	product: TutorialViewProps['product']
	setCollectionViewSidebarSections: Dispatch<
		SetStateAction<CollectionCategorySidebarSection[]>
	>
}

export type {
	CollectionContext,
	LayoutContentWrapperProps,
	TutorialData,
	TutorialSidebarSidecarProps,
	TutorialViewProps,
}
