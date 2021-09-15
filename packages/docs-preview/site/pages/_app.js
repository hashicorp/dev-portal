import './style.css'
import Min100Layout from '@hashicorp/react-min-100-layout'
import Placeholder from 'components/placeholder'
import Link from 'next/link'
import { productName } from 'data/metadata'

export default function App({ Component, pageProps }) {
  return (
    <Min100Layout footer={<Placeholder>Footer</Placeholder>}>
      <Placeholder>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <span style={{ padding: '0 0.5rem' }}>{productName}</span>
          <Link href="/docs">
            <a style={{ padding: '0 0.5rem' }}>/docs</a>
          </Link>
          <Link href="/downloads">
            <a style={{ padding: '0 0.5rem' }}>/downloads</a>
          </Link>
        </div>
      </Placeholder>
      <Component {...pageProps} />
    </Min100Layout>
  )
}
