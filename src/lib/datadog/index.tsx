import Script from 'next/script'

/**
 * Env used for configuration
 */
const COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
const ENV = process.env.HASHI_ENV || 'development'

/**
 * Constants used for configuration
 */
const DATADOG_SCRIPT_URL =
  'https://www.datadoghq-browser-agent.com/datadog-rum-v4.js'
const DATADOG_CLIENT_TOKEN = 'pub750ceadc5a9c79a6d3da59b534eb5108'
const DATADOG_APP_ID = '4486817b-44b8-4e6c-b6a4-cef83e48cf46'
const DATADOG_SERVICE = 'developer.hashicorp.com'

const datadogScriptBody = `(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','${DATADOG_SCRIPT_URL}','DD_RUM')
 DD_RUM.onReady(function() {
   DD_RUM.init({
     clientToken: '${DATADOG_CLIENT_TOKEN}',
     applicationId: '${DATADOG_APP_ID}',
     site: 'datadoghq.com',
     service: '${DATADOG_SERVICE}',
     env: '${ENV}', 
     ${COMMIT_SHA ? `version: '${COMMIT_SHA}',` : ''}
     sampleRate: 100,
     premiumSampleRate: 100,
     trackInteractions: false,
     defaultPrivacyLevel: 'mask-user-input'
   })
   DD_RUM.startSessionReplayRecording()
 })`

function DatadogHeadTag() {
  return <link rel="prefetch" href={DATADOG_SCRIPT_URL} />
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
