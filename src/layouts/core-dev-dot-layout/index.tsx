import Head from 'next/head'

import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <DatadogHeadTag />
      </Head>
      <div className={s.root}>{children}</div>
      <DatadogScriptTag />
    </>
  )
}

export default CoreDevDotLayout
