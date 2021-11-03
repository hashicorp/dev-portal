import Link from 'next/link'

export default function Homepage() {
  return (
    <div className="g-grid-container">
      <h1>Welcome to Dev Portal</h1>
      <h2>Dev Portal links</h2>
      <ul>
        <li>
          <Link href="/consul">Consul</Link>
        </li>
        <li>
          <Link href="/nomad">Nomad</Link>
        </li>
        <li>
          <Link href="/vault">Vault</Link>
        </li>
        <li>
          <Link href="/waypoint">Waypoint</Link>
        </li>
      </ul>
      <h2>Proxied sites</h2>
      <ul>
        <li>
          <a href="/_proxied-dot-io/waypoint">Proxied Waypoint</a>
        </li>
        <li>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/_proxied-dot-io/boundary">Proxied Boundary</a>
        </li>
      </ul>
    </div>
  )
}
