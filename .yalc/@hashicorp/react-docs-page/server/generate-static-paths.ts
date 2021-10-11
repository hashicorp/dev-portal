import moize, { Options } from 'moize'

import { fetchNavData, fetchVersionMetadataList } from '../content-api'

import { getPathsFromNavData } from './get-paths-from-nav-data'
import { resolveNavData } from './resolve-nav-data'

import { DEFAULT_PARAM_ID } from './consts'

const moizeOpts: Options = { isPromise: true, maxSize: Infinity }
const cachedFetchNavData = moize(fetchNavData, moizeOpts)
const cachedFetchVersionMetadataList = moize(
  fetchVersionMetadataList,
  moizeOpts
)

export interface GenerateStaticPathsContext {
  /** @example 'data/docs-nav-data.json' */
  navDataFile: string
  /** @example 'content/docs' */
  localContentDir: string
  /**
   * @default 'page'
   */
  paramId?: string
  /**
   * @example { name: 'Waypoint', slug: 'waypoint' }
   */
  product?: { name: string; slug: string }
  /** @example 'docs' */
  basePath?: string
}

const defaultOptions = {
  VERCEL_ENV: process.env.VERCEL_ENV,
  ENABLE_VERSIONED_DOCS: process.env.ENABLE_VERSIONED_DOCS === 'true',
}

export async function generateStaticPaths(
  {
    navDataFile,
    localContentDir,
    paramId = DEFAULT_PARAM_ID,
    product,
    basePath,
  }: GenerateStaticPathsContext,
  { ENABLE_VERSIONED_DOCS, VERCEL_ENV } = defaultOptions
) {
  let navData

  // This code path handles versioned docs integration, which is currently gated behind the ENABLE_VERSIONED_DOCS env var
  if (ENABLE_VERSIONED_DOCS && VERCEL_ENV === 'production') {
    // Fetch version metadata to get "latest"
    const versionMetadataList = await cachedFetchVersionMetadataList(
      product.slug
    )
    const latest = versionMetadataList.find((e) => e.isLatest).version
    // Fetch and parse navigation data
    navData = (await cachedFetchNavData(product.slug, basePath, latest)).navData
  } else {
    navData = await resolveNavData(navDataFile, localContentDir)
  }

  return getPathsFromNavData(navData, paramId)
}
