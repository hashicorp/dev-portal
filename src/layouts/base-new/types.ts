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
}

export type { BaseNewLayoutProps }
