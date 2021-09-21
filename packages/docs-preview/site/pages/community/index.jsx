import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'
import Head from 'next/head'
import s from './style.module.css'
import communityPageData from 'data/community-page-data'
import { productName, productSlug } from 'data/metadata'

export default function CommunityPage() {
  const { subheading, links } = communityPageData
  return (
    <div className={s.communityPage}>
      <Head>
        <title key="title">Community | {productName} by HashiCorp</title>
      </Head>
      <div className={s.sectionHeaderWrapper}>
        <SectionHeader
          headline="Community"
          description={subheading}
          use_h1={true}
        />
      </div>
      <VerticalTextBlockList product={productSlug} data={links} />
    </div>
  )
}
