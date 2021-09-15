import productMetadata from 'data/metadata.json'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'
import styles from './style.module.css'

function DownloadsPage({ releases, product, latestVersion, packageManagers }) {
  return (
    <ProductDownloadsPage
      releases={releases}
      packageManagers={packageManagers}
      productName={product.name}
      productId={product.slug}
      latestVersion={latestVersion}
      getStartedDescription="Follow step-by-step tutorials on AWS, Azure, GCP, and localhost."
      getStartedLinks={[
        {
          label: 'Deploy to Docker',
          href: 'https://learn.hashicorp.com/collections/waypoint/get-started-docker',
        },
        {
          label: 'Deploy to Kubernetes',
          href: 'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
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
      product="waypoint"
      tutorialLink={{
        href: 'https://learn.hashicorp.com/waypoint',
        label: 'View Tutorials at HashiCorp Learn',
      }}
    />
  )
}

export async function getStaticProps() {
  const { product, latestVersion, packageManagers } = productMetadata
  const staticProps = await generateStaticProps({
    product: product.slug,
    latestVersion,
  })
  const releases = staticProps.props.releases
  return {
    props: {
      releases,
      product,
      latestVersion,
      packageManagers,
    },
  }
}

export default DownloadsPage
