import { ConsentManagerService } from '@hashicorp/react-consent-manager/types'

const DATADOG_SCRIPT_URL =
  'https://www.datadoghq-browser-agent.com/datadog-rum-v4.js'
const DATADOG_CLIENT_TOKEN = 'TODO-need-access-to-datadog'
const DATADOG_APP_ID = 'TODO-need-access-to-datadog'
const DATADOG_SITE = 'TODO-need-access-to-datadog'
const ENV = process.env.HASHI_ENV || 'development'

const devDotConsentManagerServices: ConsentManagerService[] = [
  /**
   * DataDog
   */
  {
    name: 'DataDog',
    description:
      'Datadog is an observability service. We use it to identify and fix issues with our client-side user experience.',
    category: 'Analytics',
    async: true,
    /**
     * Note: `body` is from:
     * https://docs.datadoghq.com/real_user_monitoring/browser/#cdn-async
     *
     * Note on trackInteractions: according to DataDog (at link above):
     * "The trackInteractions parameter enables the automatic collection of
     * user clicks in your application. Sensitive and private data contained
     * on your pages may be included to identify the elements interacted with."
     * Given this, I've set to "false" for now. I don't believe there is any
     * sensitive or private data within the dev-portal experience at this time,
     * but want to double-check on that.
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
  },
]

export { devDotConsentManagerServices, DATADOG_SCRIPT_URL }
