import { GetStaticProps } from 'next'
import HomePageView from 'views/homepage'
import { HomePageAuthoredContent } from 'views/homepage/contentSchema'
import { generateStaticProps } from 'views/homepage/server'
import pageContent from './content.json'

export const getStaticProps: GetStaticProps = async () => {
  return generateStaticProps(pageContent as HomePageAuthoredContent)
}

export default HomePageView
