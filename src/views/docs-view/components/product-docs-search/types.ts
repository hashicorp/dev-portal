import { Hit } from '@algolia/client-search'

export type AutocompleteItem = Hit<{
  page_title: string
  description: string
  objectID: string
}>
