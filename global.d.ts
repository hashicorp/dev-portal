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
 * Application config, defined in environment-specific JSON files in `config/`
 */
declare const __config: Record<string, any>
