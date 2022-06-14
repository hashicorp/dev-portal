import { GetStaticProps } from 'next'
import BaseNewLayout from 'layouts/base-new'
import HomePageView from 'views/homepage'
import { generateStaticProps } from 'views/homepage/server'

export const getStaticProps: GetStaticProps = async () => {
  return generateStaticProps({
    featuredLearnContent: [
      {
        collectionSlug: 'vault/associate-cert',
      },
      {
        collectionSlug: 'vault/ops-pro-cert',
      },
    ],
  })
}

HomePageView.layout = BaseNewLayout
export default HomePageView
