import Head from 'next/head'
import { useRouter } from 'next/router'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { MobileMenuProvider } from 'contexts'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
  const router = useRouter()
  const isSwingset = router.asPath.startsWith('/swingset')

  return (
    <MobileMenuProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <DatadogHeadTag />
      </Head>
      <div className={s.root}>{children}</div>
      {isSwingset ? null : <DatadogScriptTag />}
    </MobileMenuProvider>
  )
}

export default CoreDevDotLayout
