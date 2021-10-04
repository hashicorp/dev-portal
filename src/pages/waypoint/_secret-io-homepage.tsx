import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function WaypointSecretMarketingHomepage() {
  return (
    <div className="g-grid-container">
      <h1>Welcome to the secret Waypoint Marketing Homepage</h1>
      <ul>
        <li>
          <Link href="/waypoint/docs">View Waypoint Docs</Link>
        </li>
      </ul>
    </div>
  )
}
