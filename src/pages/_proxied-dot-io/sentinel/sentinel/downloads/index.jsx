import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from '@hashicorp/react-product-downloads-page/server'
import VERSION from '../../../data/version'
import s from './style.module.css'

export default function DownloadsPage(staticProps) {
  return (
    <ProductDownloadsPage
      logo={<p className={s.notALogo}>Sentinel</p>}
      changelog="/sentinel/changelog"
      getStartedLinks={[
        {
          label: 'Installation Instructions',
          href: '/sentinel/intro/getting-started/install',
        },
        {
          label: 'Community Resources',
          href: 'https://discuss.hashicorp.com/c/sentinel/',
        },
      ]}
      packageManagerOverrides={[
        // Note: Duplicate Homebrew entries target
        // both macOS and Linux. If one is removed,
        // then Homebrew will show up under the Linux tab.
        {
          label: 'Homebrew',
          os: 'NONE--IGNORE',
        },
        {
          label: 'Homebrew',
          os: 'NONE--IGNORE',
        },
        {
          label: 'Amazon Linux',
          os: 'NONE--IGNORE',
        },
        {
          label: 'Fedora',
          os: 'NONE--IGNORE',
        },
        {
          label: 'Ubuntu/Debian',
          os: 'NONE--IGNORE',
        },
        {
          label: 'CentOS/RHEL',
          os: 'NONE--IGNORE',
        },
      ]}
      {...staticProps}
    />
  )
}

export async function getStaticProps() {
  return await generateStaticProps({
    product: 'sentinel',
    latestVersion: VERSION,
  })
}
