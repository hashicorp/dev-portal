import { GetStaticPathsContext, GetStaticPropsContext } from 'next'

export interface DataLoader {
  opts: DataLoaderOpts
  loadStaticPaths(ctx?: GetStaticPathsContext): Promise<$TSFixMe>
  loadStaticProps(ctx?: GetStaticPropsContext): Promise<$TSFixMe>
}

export interface DataLoaderOpts {
  product: string
  paramId?: string
}

export interface DataLoaderContext {
  navDataFile: string
  localContentDir: string
  params: Record<string, string[]> // {} | { page: ["destroy"] }
  product: string
  mainBranch?: string // = 'main',
  remarkPlugins?: any[]
  scope?: any // optional, I think?
  basePath: string // 'docs'
}
