import Script from 'next/script'
import { ConsentManagerService } from '@hashicorp/react-consent-manager/types'

const DATADOG_SCRIPT_URL =
  'https://www.datadoghq-browser-agent.com/datadog-rum-v4.js'
const DATADOG_CLIENT_TOKEN = 'TODO-need-access-to-datadog'
const DATADOG_APP_ID = 'TODO-need-access-to-datadog'
const DATADOG_SITE = 'TODO-need-access-to-datadog'
const ENV = process.env.HASHI_ENV || 'development'

const dataDogService: ConsentManagerService = {
  name: 'DataDog',
  description:
    'Datadog is an observability service. We use it to identify and fix issues with our client-side user experience.',
  category: 'Analytics',
  async: true,
  /**
   * Note: `body` is from:
   * https://docs.datadoghq.com/real_user_monitoring/browser/#cdn-async
   */
  body: `(function(h,o,u,n,d) {
   h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
   d=o.createElement(u);d.async=1;d.src=n
   n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','${DATADOG_SCRIPT_URL}','DD_RUM')
  DD_RUM.onReady(function() {
    DD_RUM.init({
      clientToken: '${DATADOG_CLIENT_TOKEN}',
      applicationId: '${DATADOG_APP_ID}',
      site: '${DATADOG_SITE}',
      env: '${ENV}', 
      trackInteractions: false,
    })
  })`,
}

function DataDogScriptTag() {
  return (
    <Script id={dataDogService.name} strategy="afterInteractive">
      {dataDogService.body}
    </Script>
  )
}

export { DataDogScriptTag, DATADOG_SCRIPT_URL, dataDogService }
