import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import {
  generateStaticProps,
  ReleasesAPIResponse,
} from 'lib/fetch-release-data'
import styles from './style.module.css'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function WaypointDownloadsPage({
  latestVersion,
  releases,
}: {
  latestVersion: string
  releases: ReleasesAPIResponse
}) {
  const getStartedDescription =
    'Follow step-by-step tutorials on AWS, Azure, GCP, and localhost.'
  const getStartedLinks = [
    {
      label: 'Deploy to Docker',
      href:
        'https://learn.hashicorp.com/collections/waypoint/get-started-docker',
    },
    {
      label: 'Deploy to Kubernetes',
      href:
        'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
    },
    {
      label: 'Deploy to AWS',
      href: 'https://learn.hashicorp.com/collections/waypoint/deploy-aws',
    },
    {
      label: 'View all Waypoint tutorials',
      href: 'https://learn.hashicorp.com/waypoint',
    },
  ]
  const logo = ( // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.logo}
      alt="Waypoint"
      src={require('./img/waypoint-logo.svg')}
    />
  )
  const tutorialLink = {
    href: 'https://learn.hashicorp.com/waypoint',
    label: 'View Tutorials at HashiCorp Learn',
  }

  return (
    <ProductDownloadsPage
      enterpriseMode={false}
      getStartedDescription={getStartedDescription}
      getStartedLinks={getStartedLinks}
      latestVersion={latestVersion}
      logo={logo}
      merchandisingSlot={null}
      product="waypoint"
      releases={releases}
      tutorialLink={tutorialLink}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getStaticProps = () => generateStaticProps('waypoint')

WaypointDownloadsPage.layout = WaypointIoLayout
export default WaypointDownloadsPage
