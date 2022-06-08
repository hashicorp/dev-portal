import { useRouter } from 'next/router'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import Head from 'next/head'

import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout: React.FC = ({ children }) => {
  const router = useRouter()
  const isSwingset = router.asPath.startsWith('/swingset')

  return (
    <>
      <Head>
        <DatadogHeadTag />
      </Head>
      <div className={s.root}>{children}</div>
      {isSwingset ? null : <DatadogScriptTag />}
    </>
  )
}

export default CoreDevDotLayout
