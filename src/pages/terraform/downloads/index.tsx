import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import semverGte from 'semver/functions/gte'
import semverMajor from 'semver/functions/major'
import semverMinor from 'semver/functions/minor'
import semverPatch from 'semver/functions/patch'
import terraformData from 'data/terraform.json'
import installData from 'data/terraform-install.json'
import { ProductData } from 'types/products'
import { generateStaticProps, GeneratedProps } from 'lib/fetch-release-data'
import CoreDevDotLayout from 'layouts/core-dev-dot-layout'
import ProductDownloadsView from 'views/product-downloads-view'
import PlaceholderDownloadsView from 'views/placeholder-product-downloads-view'

const VERSION_DOWNLOAD_CUTOFF = '1.0.11'

const TerraformDownloadsPage = (props: GeneratedProps): ReactElement => {
  if (__config.flags.enable_new_downloads_view) {
    const { latestVersion, releases } = props
    return (
      <ProductDownloadsView
        latestVersion={latestVersion}
        pageContent={installData}
        releases={releases}
      />
    )
  } else {
    return <PlaceholderDownloadsView />
  }
}

/**
 * Pulled from terraform-website/pages/downloads/index.jsx on 3/9/2022:
 * https://github.com/hashicorp/terraform-website/blob/master/pages/downloads/index.jsx#L55-L98
 */
function filterOldVersions(props) {
  if (!props?.props?.releases?.versions) {
    return props
  }

  const versions = props.props.releases.versions

  // versions is in the form of { [version]: { ...metadata } }
  // Filter by arbitrary & reasonable version cutoff
  const filteredVersions = Object.keys(versions).filter((version) => {
    if (!semverGte(version, VERSION_DOWNLOAD_CUTOFF)) {
      return false
    }
    return true
  })

  /** @type {{[x: string]:{ [y: string]: any}}} */
  const tree = {}

  /**
   * Computes the latest patch versions for each major/minor
   * e.g. given [1.1.2, 1.1.1, 1.1.0, 1.0.9, 1.0.8] -> return [1.1.2, 1.0.9]
   */
  filteredVersions.forEach((v) => {
    const x = semverMajor(v)
    const y = semverMinor(v)
    const z = semverPatch(v)

    if (!tree[x]) {
      tree[x] = { [y]: z }
    } else if (!tree[x][y]) {
      tree[x][y] = z
    } else {
      tree[x][y] = Math.max(tree[x][y], z)
    }
  })

  const newVersions = {}

  Object.entries(tree).forEach(([x, xObj]) => {
    Object.entries(xObj).forEach(([y, z]) => {
      const version = `${x}.${y}.${z}`
      newVersions[version] = versions[version]
    })
  })

  props.props.releases.versions = newVersions
}

export const getStaticProps: GetStaticProps = async () => {
  const product = terraformData as ProductData
  const generatedProps = await generateStaticProps(product)

  filterOldVersions(generatedProps)

  return generatedProps
}

TerraformDownloadsPage.layout = CoreDevDotLayout

export default TerraformDownloadsPage
