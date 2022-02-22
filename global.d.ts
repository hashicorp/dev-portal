/// <reference types="@hashicorp/platform-types" />

declare module 'swingset/page' {
  const createPage: () => $TSFixMe

  export default createPage
}

declare module 'swingset/server' {
  const createStaticPaths: $TSFixMe
  const createStaticProps: $TSFixMe

  export { createStaticPaths, createStaticProps }
}

/**
 * Application config, defined in environment-specific JSON files in `config/`
 */
declare const __config: Record<string, any>

declare module '@hashicorp/react-search'
