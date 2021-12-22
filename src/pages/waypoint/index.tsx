import { ReactElement } from 'react'
import BaseNewLayout from 'layouts/base-new'

const WaypointHomePage = (): ReactElement => (
  <div className="g-grid-container">
    <h1>Welcome to Waypoint</h1>
    <ul>
      <li>This page is a work in progress</li>
    </ul>
  </div>
)

WaypointHomePage.layout = BaseNewLayout

export default WaypointHomePage
