import Link from 'next/link'

function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/docs">
            <a>/docs</a>
          </Link>
        </li>
        <li>
          <Link href="/downloads">
            <a>/downloads</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
