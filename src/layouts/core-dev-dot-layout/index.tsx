import Head from 'next/head'
import { DatadogHeadTag, DatadogScriptTag } from 'lib/datadog'
import { MobileMenuProvider } from 'contexts'
import { CoreDevDotLayoutProps } from './types'
import s from './core-dev-dot-layout.module.css'

const CoreDevDotLayout = ({ children }: CoreDevDotLayoutProps) => {
  return (
    <MobileMenuProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <DatadogHeadTag />
      </Head>
      <div className={s.root}>{children}</div>
      <DatadogScriptTag />
    </MobileMenuProvider>
  )
}

export default CoreDevDotLayout
