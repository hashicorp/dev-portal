import path from 'path'
import fs from 'fs'
import { getPathsFromNavData } from '../get-paths-from-nav-data'
import { resolveNavData } from '../resolve-nav-data'

import { DEFAULT_PARAM_ID } from '../consts'

import renderPageMdx from '../../render-page-mdx'

import { getNodeFromPath } from '../get-node-from-path'

import { DataLoader, DataLoaderOpts } from './types'

interface FileSystemLoaderOpts extends DataLoaderOpts {
  navDataFile: string
  localContentDir: string
}

export interface FileSystemLoaderContext {
  params: Record<string, string[]> // {} | { page: ["destroy"] }
  mainBranch?: string // = 'main',
  remarkPlugins?: $TSFixMe[]
  scope?: Record<string, $TSFixMe> // optional, I think?
  basePath: string // 'docs'
}

export default class FileSystemLoader implements DataLoader {
  opts: FileSystemLoaderOpts

  constructor(opts: FileSystemLoaderOpts) {
    this.opts = opts

    if (!this.opts.paramId) this.opts.paramId = DEFAULT_PARAM_ID
  }

  loadStaticPaths = async (): Promise<$TSFixMe> => {
    const navData = await resolveNavData(
      this.opts.navDataFile,
      this.opts.localContentDir
    )
    return getPathsFromNavData(navData, this.opts.paramId)
  }

  loadStaticProps = async ({
    params,
    remarkPlugins = [],
    scope,
    mainBranch = 'main',
  }: FileSystemLoaderContext): Promise<$TSFixMe> => {
    const mdxRenderer = (mdx) =>
      renderPageMdx(mdx, {
        remarkPlugins,
        scope,
      })
    // Build the currentPath from page parameters
    const currentPath = params[this.opts.paramId]
      ? params[this.opts.paramId].join('/')
      : ''
    //  Read in the nav data, and resolve local filePaths
    const navData = await resolveNavData(
      this.opts.navDataFile,
      this.opts.localContentDir
    )
    //  Get the navNode that matches this path
    const navNode = getNodeFromPath(
      currentPath,
      navData,
      this.opts.localContentDir
    )
    //  Read in and process MDX content from the navNode's filePath
    const mdxFile = path.join(process.cwd(), navNode.filePath)
    const mdxString = fs.readFileSync(mdxFile, 'utf8')
    const { mdxSource, frontMatter } = await mdxRenderer(mdxString)

    // Construct the githubFileUrl, used for "Edit this page" link
    const githubFileUrl = `https://github.com/hashicorp/${this.opts.product}/blob/${mainBranch}/website/${navNode.filePath}`
    // Return all the props
    return {
      currentPath,
      frontMatter,
      githubFileUrl,
      mdxSource,
      navData,
      versions: [],
    }
  }
}
