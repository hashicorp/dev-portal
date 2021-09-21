import './style.css'
import Min100Layout from '@hashicorp/react-min-100-layout'
import Placeholder from 'components/placeholder'
import Subnav from 'components/subnav'

export default function App({ Component, pageProps }) {
  return (
    <Min100Layout
      footer={
        <Placeholder>
          Footer
          <br />
          (Placeholder for local preview)
        </Placeholder>
      }
    >
      <Subnav />
      <Component {...pageProps} />
    </Min100Layout>
  )
}
