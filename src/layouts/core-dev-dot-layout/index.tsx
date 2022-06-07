import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import Head from 'next/head'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout: React.FC = ({ children }) => (
  <>
    <Head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <DatadogHeadTag />
    </Head>
    <div className={s.root}>{children}</div>
    <DatadogScriptTag />
  </>
)

export default CoreDevDotLayout
