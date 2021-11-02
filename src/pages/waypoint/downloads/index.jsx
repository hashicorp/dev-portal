import waypointConfig from '../../../../config/waypoint.json'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import WaypointIoLayout from 'layouts/_proxied-dot-io/waypoint'
import styles from './style.module.css'
// Imports below are server-side only
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'

function DownloadsPage({ releases }) {
  return (
    <ProductDownloadsPage
      releases={releases}
      packageManagers={waypointConfig.packageManagers}
      productName={waypointConfig.name}
      productId={waypointConfig.slug}
      latestVersion={waypointConfig.version} // temporary. switch to remote fetch
      getStartedDescription="Follow step-by-step tutorials on AWS, Azure, GCP, and localhost."
      getStartedLinks={[
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
      ]}
      logo={
        <img
          className={styles.logo}
          alt="Waypoint"
          src={require('./img/waypoint-logo.svg')}
        />
      }
      product={waypointConfig.slug}
      tutorialLink={{
        href: 'https://learn.hashicorp.com/waypoint',
        label: 'View Tutorials at HashiCorp Learn',
      }}
    />
  )
}

export const getStaticProps = () =>
  generateStaticProps({
    product: waypointConfig.slug,
    latestVersion: waypointConfig.version, // temporary. switch to remote fetch
  })

DownloadsPage.layout = WaypointIoLayout
export default DownloadsPage
