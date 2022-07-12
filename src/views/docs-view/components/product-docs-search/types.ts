import { Hit } from '@algolia/client-search'

export type DocsSearchHit = Hit<{
  /**
   * The page title of the indexed document
   */
  page_title: string

  /**
   * The description of the indexed document
   */
  description: string

  /**
   * Headings extracted from the indexed document
   */
  headings?: string[]
}>
