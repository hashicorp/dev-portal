/**
 *
 * NOTE 2/18/2022 - THIS FILE IS LARGELY COPIED FROM:
 * @hashicorp/react-product-downloads-page/server
 *
 */

import { GetStaticPropsResult } from 'next'
import { Product, ProductSlug } from 'types/products'
import { makeFetchWithRetry } from './utils/fetch-with-retry'

type OperatingSystem =
  | 'darwin'
  | 'freebsd'
  | 'openbsd'
  | 'netbsd'
  | 'archlinux'
  | 'linux'
  | 'windows'

interface ReleaseVersion {
  name: ProductSlug
  version: string
  shasums: string
  shasums_signature: string
  builds: {
    name: ProductSlug
    version: string
    os: OperatingSystem
    arch: string
    filename: string
    url: string
  }[]
}

export interface ReleasesAPIResponse {
  name: ProductSlug
  versions: {
    [versionNumber: string]: ReleaseVersion
  }
}

interface Props {
  product: Product
}

/**
 * There is a bit of a race condition with product releases and the metadata for
 * the latest release propagating to releases.hashicorp.com. Often all it takes
 * is a re-deploy of the website for it to work, so we're introducing a retry
 * when fetching the release data in hopes that we can avoid manual
 * intervention.
 */
const fetchWithRetry = makeFetchWithRetry(fetch, { retries: 3, delay: 1000 })

export function generateStaticProps({
  product,
}: Props): Promise<GetStaticPropsResult<{ releases: ReleasesAPIResponse }>> {
  const productSlug = product.slug
  const latestVersion = product.version

  return fetchWithRetry(
    `https://releases.hashicorp.com/${productSlug}/index.json`,
    {
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  )
    .then((res) => res.json())
    .then((result) => {
      return {
        props: {
          product,
          releases: result,
        },
      }
    })
    .catch(() => {
      throw new Error(
        `--------------------------------------------------------
        Unable to resolve version ${latestVersion} on releases.hashicorp.com from link
        <https://releases.hashicorp.com/${productSlug}/${latestVersion}/index.json>. Usually this
        means that the specified version has not yet been released. The downloads page
        version can only be updated after the new version has been released, or it will point
        to broken release links.
        ----------------------------------------------------------`
      )
    })
}
