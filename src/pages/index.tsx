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
          <Link href="/_proxied-dot-io/waypoint">Proxied Waypoint</Link>
        </li>
        <li>
          <Link href="/_proxied-dot-io/boundary">Proxied Boundary</Link>
        </li>
      </ul>
    </div>
  )
}
