import { ReactNode } from 'react'

export interface ImageConfigProps {
  /**
   * An MDX `img`, e.g. `![some alt text](path/to/img.jpg)`
   */
  children: ReactNode
  /**
   * A caption to display below the image.
   */
  caption?: string
  /**
   * Hide borders (temporarily configurable in Learn while we remove
   * baked-in borders from existing images)
   */
  hideBorder?: boolean
}
