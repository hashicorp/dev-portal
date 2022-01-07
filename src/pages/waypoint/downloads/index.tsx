import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import BaseNewLayout from 'layouts/base-new'

const product = waypointData as Product

const WaypointDowloadsPage = (): ReactElement => {
  return (
    <div className="g-grid-container">
      <h1>Waypoint Downloads</h1>
      <ul>
        <li>This page is a work in progress</li>
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { product },
    revalidate: 10,
  }
}

WaypointDowloadsPage.layout = BaseNewLayout

export default WaypointDowloadsPage
