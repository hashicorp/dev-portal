import Script from 'next/script'

/**
 * Env used for configuration
 */
const COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
/**
 * TODO: distinguish development environments by machine?
 */
const ENV = process.env.HASHI_ENV || 'development'

/**
 * Constants used for configuration
 */
const DATADOG_CONFIG = __config.dev_dot.datadog_config

const datadogScriptBody = `(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','${DATADOG_CONFIG.scriptUrl}','DD_RUM')
 DD_RUM.onReady(function() {
   DD_RUM.init({
     clientToken: '${DATADOG_CONFIG.clientToken}',
     applicationId: '${DATADOG_CONFIG.applicationId}',
     site: 'datadoghq.com',
     service: '${DATADOG_CONFIG.service}',
     env: '${ENV}', 
     ${COMMIT_SHA ? `version: '${COMMIT_SHA}',` : ''}
     sampleRate: 100,
     premiumSampleRate: 100,
     trackInteractions: true,
     defaultPrivacyLevel: 'mask-user-input'
   })
   DD_RUM.startSessionReplayRecording()
 })`

function DatadogHeadTag() {
  return <link rel="prefetch" href={DATADOG_CONFIG.scriptUrl} />
}

function DatadogScriptTag() {
  return (
    <Script
      id="datadog-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: datadogScriptBody,
      }}
    />
  )
}

export { DatadogHeadTag, DatadogScriptTag, datadogScriptBody }
