import { DisclosureProps } from 'components/disclosure'
import { ReactNode } from 'react'

export interface AccordionDisclosureProps {
  /**
   * The disclosed content to render within the `AccordionDisclosure` container.
   * This will only show when the `AccordionDisclosure` is open.
   */
  children: ReactNode

  /**
   * Secondary label text that renders below the main `title` with less
   * emphasis. Always shows regardless of the `AccordionDisclosure`'s
   * open/closed state.
   */
  description?: string

  /**
   * Optional prop that that enables a `AccordionDisclosure` to be open on
   * render.
   */
  open?: DisclosureProps['open']

  /**
   * The main text label that always shows regardless of the
   * `AccordionDisclosure`'s open/closed state. These should be descriptive of
   * the disclosed content; labels like "Section 1" or "Section 2" is not very
   * descriptive.
   */
  title: string
}
