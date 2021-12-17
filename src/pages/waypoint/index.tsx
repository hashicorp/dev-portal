import NavigationHeader from 'components/navigation-header'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Homepage() {
  return (
    <>
      <NavigationHeader />
      <div className="g-grid-container">
        <h1>Welcome to Waypoint</h1>
        <ul>
          <li>This page is a work in progress</li>
        </ul>
      </div>
    </>
  )
}
