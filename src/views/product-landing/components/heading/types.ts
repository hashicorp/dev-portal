export interface HeadingProps {
  slug: string
  heading: string
  /** Set the HTML heading level. */
  level: 1 | 2 | 3 | 4 | 5 | 6
  /** Optionally use a different heading-x style than the default for the semantic HTML heading level. Note that only 0-4 are supported, as these are the styles we have available from the design system. */
  style_as?: 0 | 1 | 2 | 3 | 4
}
