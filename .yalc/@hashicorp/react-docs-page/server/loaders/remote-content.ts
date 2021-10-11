import moize, { Options } from 'moize'
import renderPageMdx from '../../render-page-mdx'
import {
  fetchNavData,
  fetchVersionMetadataList,
  fetchDocument,
} from '../../content-api'
import { stripVersionFromPathParams } from '../../util'

import { DEFAULT_PARAM_ID } from '../consts'

import { DataLoader, DataLoaderOpts } from './types'
import { getPathsFromNavData } from '../get-paths-from-nav-data'

export interface RemoteContentLoaderContext {
  params: Record<string, string[]> // {} | { page: ["destroy"] }
  mainBranch?: string // = 'main',
  remarkPlugins?: $TSFixMe[]
  scope?: Record<string, $TSFixMe> // optional, I think?
}

interface RemoteContentLoaderOpts extends DataLoaderOpts {
  basePath: string
}

/**
 * TODO: export this from future content-api client
 * @see https://app.asana.com/0/1100423001970639/1201071725174928/f
 */
interface VersionMetadataItem {
  product: string
  ref: string
  version: string
  created_at: string
  display?: string
  sha: string
  isLatest?: boolean
  fullPath: string
}

interface VersionSelectItem {
  name: string
  label: string
}

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedFetchNavData = moize(fetchNavData, moizeOpts)
const cachedFetchVersionMetadataList = moize(
  fetchVersionMetadataList,
  moizeOpts
)

/**
 * formats a list of version-metadata to
 * be passed to `<VersionSelect versions=[...] />`
 */
export function mapVersionList(
  list: VersionMetadataItem[]
): VersionSelectItem[] {
  const versions = list.map((e) => {
    const { isLatest, version, display } = e

    const displayValue = display ?? version

    return {
      name: isLatest ? 'latest' : version,
      label: isLatest ? `${displayValue} (latest)` : displayValue,
    }
  })

  return versions
}

export default class RemoteContentLoader implements DataLoader {
  opts: RemoteContentLoaderOpts

  constructor(opts: RemoteContentLoaderOpts) {
    this.opts = opts

    if (!this.opts.paramId) this.opts.paramId = DEFAULT_PARAM_ID
  }

  loadStaticPaths = async (): Promise<$TSFixMe> => {
    // Fetch version metadata to get "latest"
    const versionMetadataList = await cachedFetchVersionMetadataList(
      this.opts.product
    )
    const latest = versionMetadataList.find((e) => e.isLatest).version
    // Fetch and parse navigation data
    return getPathsFromNavData(
      (await cachedFetchNavData(this.opts.product, this.opts.basePath, latest))
        .navData,
      this.opts.paramId
    )
  }

  loadStaticProps = async ({
    params,
    mainBranch = 'main', // we should pull this from config
    remarkPlugins = [], // do we really need this?
    scope, // only used once: https://sourcegraph.hashi-mktg.com/search?q=scope:+lang:javascript+file:website*&patternType=literal this can also be passed to the component
  }: RemoteContentLoaderContext): Promise<$TSFixMe> => {
    // Build the currentPath from page parameters
    const currentPath = params[this.opts.paramId]
      ? params[this.opts.paramId].join('/')
      : ''

    const mdxRenderer = (mdx) =>
      renderPageMdx(mdx, {
        remarkPlugins,
        scope,
      })

    // given: v0.5.x (latest), v0.4.x, v0.3.x
    const [, paramsNoVersion] = stripVersionFromPathParams(
      params[this.opts.paramId]
    )

    const versionMetadataList: VersionMetadataItem[] =
      await cachedFetchVersionMetadataList(this.opts.product)
    // remove trailing index to ensure we fetch the right document from the DB
    const pathParamsNoIndex = paramsNoVersion.filter(
      (param, idx, arr) => !(param === 'index' && idx === arr.length - 1)
    )

    const latestVersion = versionMetadataList.find((e) => e.isLatest)?.version

    const versionToFetch = latestVersion

    const fullPath = [
      'doc',
      versionToFetch,
      this.opts.basePath,
      ...pathParamsNoIndex,
    ].join('/')

    const documentPromise = fetchDocument(this.opts.product, fullPath)
    const navDataPromise = cachedFetchNavData(
      this.opts.product,
      this.opts.basePath,
      versionToFetch
    )

    const [document, navData] = await Promise.all([
      documentPromise,
      navDataPromise,
    ])

    const { mdxSource } = await mdxRenderer(document.markdownSource)
    const frontMatter = document.metadata

    // Construct the githubFileUrl, used for "Edit this page" link

    // Must be serializeable
    let githubFileUrl = null

    if (document.githubFile) {
      // Link latest version to `main`
      // Hide link on older versions
      const isLatest = versionMetadataList.find(
        (e) => e.version === document.version
      ).isLatest
      if (isLatest) {
        // GitHub only allows you to modify a file if you are on a branch, not a commit
        githubFileUrl = `https://github.com/hashicorp/${this.opts.product}/blob/${mainBranch}/${document.githubFile}`
      }
    }

    return {
      versions: mapVersionList(versionMetadataList),
      currentPath,
      frontMatter,
      githubFileUrl,
      mdxSource,
      navData: navData.navData,
    }
  }
}
