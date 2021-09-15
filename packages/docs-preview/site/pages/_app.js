import './style.css'
import Min100Layout from '@hashicorp/react-min-100-layout'
import Placeholder from 'components/placeholder'

export default function App({ Component, pageProps }) {
  return (
    <Min100Layout footer={<Placeholder name="Footer" />}>
      <Placeholder name="Navigation" />
      <Component {...pageProps} />
    </Min100Layout>
  )
}
