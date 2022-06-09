import { ReactNode } from 'react'

interface BaseNewLayoutProps {
  /**
   * Content to render within the layout.
   */
  children: ReactNode

  /**
   * Defaults to true. If true, the global footer will be shown at the bottom of
   * the page.
   */
  showFooter?: boolean

  /**
   * Defaults to false. If true, a border will be shown to separate
   * the footer from the page contents above.
   */
  showFooterTopBorder?: boolean
}

export type { BaseNewLayoutProps }
