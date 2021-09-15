import './style.css'
import Min100Layout from '@hashicorp/react-min-100-layout'
import Placeholder from 'components/placeholder'
import Link from "next/link"

export default function App({ Component, pageProps }) {
  return (
    <Min100Layout footer={<Placeholder>Footer</Placeholder>}>
      <Placeholder>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <span>Navigation</span>
          <Link href="/docs">
            <a>/docs</a>
          </Link>
          <Link href="/downloads">
            <a>/downloads</a>
          </Link>
        </div>
      </Placeholder>
      <Component {...pageProps} />
    </Min100Layout>
  )
}
