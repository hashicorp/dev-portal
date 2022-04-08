/// <reference types="@hashicorp/platform-types" />

declare module 'swingset/page' {
  const createPage: (opts: $TSFixMe) => $TSFixMe

  export default createPage
}

declare module 'swingset/server' {
  const createStaticPaths: $TSFixMe
  const createStaticProps: $TSFixMe

  export { createStaticPaths, createStaticProps }
}

declare module '@hashicorp/react-search'

/**
 * Modules declared after enabling noImplicitAny
 */
declare module '@hashicorp/react-inline-svg'
declare module 'nprogress'
declare module 'js-cookie'
declare module '@mdx-js/react'
declare module '@hashicorp/platform-docs-mdx'
declare module '@hashicorp/react-code-block/mdx'
declare module '@hashicorp/react-code-block'
declare module '@hashicorp/react-code-block/partials/code-tabs'

/**
 * Application config, defined in environment-specific JSON files in `config/`
 */
declare const __config: Record<string, any>
