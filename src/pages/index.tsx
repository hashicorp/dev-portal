import Link from 'next/link'
import { IconActivity16 } from 'components/icons'

export default function Homepage() {
  return (
    <div className="g-grid-container">
      <h1>
        Welcome to Dev Portal <IconActivity16 />
      </h1>
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
    </div>
  )
}
