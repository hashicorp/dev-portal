import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Homepage() {
  return (
    <div className="g-grid-container">
      <h1>Welcome to Waypoint</h1>
      <ul>
        <li>
          <Link href="/waypoint/docs">View Docs</Link>
        </li>
      </ul>
    </div>
  )
}
