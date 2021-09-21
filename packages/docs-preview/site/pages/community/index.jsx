import VerticalTextBlockList from '@hashicorp/react-vertical-text-block-list'
import SectionHeader from '@hashicorp/react-section-header'
import Head from 'next/head'
import s from './style.module.css'
import communityPageData from 'data/community-page-data'

export default function CommunityPage() {
  const { pageTitle, heading, subheading, product, links } = communityPageData
  return (
    <div className={s.communityPage}>
      <Head>
        <title key="title">{pageTitle}</title>
      </Head>
      <div className={s.sectionHeaderWrapper}>
        <SectionHeader
          headline={heading}
          description={subheading}
          use_h1={true}
        />
      </div>
      <VerticalTextBlockList product={product} data={links} />
    </div>
  )
}
