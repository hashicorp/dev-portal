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

declare module '@hashicorp/react-search'
