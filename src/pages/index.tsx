import { GetStaticProps } from 'next'
import BaseNewLayout from 'layouts/base-new'
import HomePageView from 'views/homepage'
import { generateStaticProps } from 'views/homepage/server'
import pageContent from './content.json'

export const getStaticProps: GetStaticProps = async () => {
  return generateStaticProps(pageContent)
}

HomePageView.layout = BaseNewLayout
export default HomePageView
