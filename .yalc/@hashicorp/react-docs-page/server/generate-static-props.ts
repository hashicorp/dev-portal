import path from 'path'
import fs from 'fs'
import moize, { Options } from 'moize'

import {
  fetchNavData,
  fetchDocument,
  fetchVersionMetadataList,
} from '../content-api'
import { DEFAULT_PARAM_ID } from './consts'

import renderPageMdx from '../render-page-mdx'

import { stripVersionFromPathParams, normalizeVersion } from '../util'

import { resolveNavData } from './resolve-nav-data'
import { getNodeFromPath } from './get-node-from-path'

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedFetchNavData = moize(fetchNavData, moizeOpts)
const cachedFetchVersionMetadataList = moize(
  fetchVersionMetadataList,
  moizeOpts
)

export interface GenerateStaticPropsContext {
  navDataFile: string
  localContentDir: string
  params: Record<string, string[]> // {} | { page: ["destroy"] }
  product: { name: string; slug: string }
  mainBranch?: string // = 'main',
  remarkPlugins?: any[]
  scope?: any // optional, I think?
  paramId?: string
  basePath: string // 'docs'
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

const defaultOptions = {
  VERCEL_ENV: process.env.VERCEL_ENV,
  ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS === 'true',
}

export async function generateStaticProps(
  {
    navDataFile,
    localContentDir,
    params,
    product: { name: productName, slug: productSlug },
    mainBranch = 'main',
    remarkPlugins = [],
    scope,
    paramId = DEFAULT_PARAM_ID,
    basePath,
  }: GenerateStaticPropsContext,
  { VERCEL_ENV, ENABLE_VERSIONED_DOCS } = defaultOptions
) {
  const mdxRenderer = (mdx) =>
    renderPageMdx(mdx, {
      remarkPlugins,
      scope,
    })

  // Build the currentPath from page parameters
  const currentPath = params[paramId] ? params[paramId].join('/') : ''

  // This code path handles versioned docs integration, which is currently gated behind the ENABLE_VERSIONED_DOCS env var
  if (ENABLE_VERSIONED_DOCS) {
    // given: v0.5.x (latest), v0.4.x, v0.3.x
    const [versionFromPath, paramsNoVersion] = stripVersionFromPathParams(
      params[paramId]
    )
    // versionFromPath should realistically only ever be "latest" | "v0.4.x" | "v0.3.x"
    // It could be v0.5.x if a use navigates directly to it.

    const versionMetadataList: VersionMetadataItem[] =
      await cachedFetchVersionMetadataList(productSlug)

    // Only load docs content from the DB if we're in production or there's an explicit version in the path
    // Preview and dev environments will read the "latest" content from the filesystem
    if (VERCEL_ENV === 'production' || versionFromPath !== 'latest') {
      // remove trailing index to ensure we fetch the right document from the DB
      const pathParamsNoIndex = paramsNoVersion.filter(
        (param, idx, arr) => !(param === 'index' && idx === arr.length - 1)
      )

      const latestVersion = versionMetadataList.find((e) => e.isLatest)?.version

      const versionToFetch =
        versionFromPath === 'latest'
          ? latestVersion
          : normalizeVersion(versionFromPath)

      const fullPath = [
        'doc',
        versionToFetch,
        basePath,
        ...pathParamsNoIndex,
      ].join('/')

      const documentPromise = fetchDocument(productSlug, fullPath)
      const navDataPromise = cachedFetchNavData(
        productSlug,
        basePath,
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
          githubFileUrl = `https://github.com/hashicorp/${productSlug}/blob/${mainBranch}/${document.githubFile}`
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

  //  Read in the nav data, and resolve local filePaths
  const navData = await resolveNavData(navDataFile, localContentDir)
  //  Get the navNode that matches this path
  const navNode = getNodeFromPath(currentPath, navData, localContentDir)
  //  Read in and process MDX content from the navNode's filePath
  const mdxFile = path.join(process.cwd(), navNode.filePath)
  const mdxString = fs.readFileSync(mdxFile, 'utf8')
  const { mdxSource, frontMatter } = await mdxRenderer(mdxString)

  // Construct the githubFileUrl, used for "Edit this page" link
  const githubFileUrl = `https://github.com/hashicorp/${productSlug}/blob/${mainBranch}/website/${navNode.filePath}`
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
