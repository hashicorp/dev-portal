import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
  return (
    <ProductDownloadsPage
      product={product}
      releases={releases}
      latestVersion={latestVersion}
      getStartedDescription="Follow step-by-step tutorials on the essentials of Packer."
      getStartedLinks={[
        {
          label: 'View all Packer tutorials',
          href: 'https://learn.hashicorp.com/packer',
        },
      ]}
      logo={
        <img
          className={s.logo}
          alt="Packer"
          src={require('@hashicorp/mktg-logos/product/packer/primary/color.svg')}
        />
      }
      tutorialLink={{
        href: 'https://learn.hashicorp.com/packer',
        label: 'View Tutorials at HashiCorp Learn',
      }}
    />
  )
}

export const getStaticProps = () => generateStaticProps('packer')

DownloadsPage.layout = PackerIoLayout
export default DownloadsPage
