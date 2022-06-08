export interface HeadMetadataProps {
  /**
   * The title of the current page, will be prepended to the global site title defined in config
   */
  title?: string

  /**
   * Description of the current page, render in the meta description tag. Defaults to the value in config
   */
  description?: string
}
