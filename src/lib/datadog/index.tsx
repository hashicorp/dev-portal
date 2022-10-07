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
 * Note: constants used for configuration are from our HashiConfig plugin.
 */
const datadogScriptBody = `(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','${
	__config.dev_dot.datadog_config.scriptUrl
}','DD_RUM')
 DD_RUM.onReady(function() {
   DD_RUM.init({
     clientToken: '${__config.dev_dot.datadog_config.clientToken}',
     applicationId: '${__config.dev_dot.datadog_config.applicationId}',
     site: 'datadoghq.com',
     service: '${__config.dev_dot.datadog_config.service}',
     env: '${ENV}', 
     ${COMMIT_SHA ? `version: '${COMMIT_SHA}',` : ''}
     sampleRate: 100,
     premiumSampleRate: 0,
     sessionReplaySampleRate: 0,
     trackInteractions: true,
     defaultPrivacyLevel: 'mask-user-input'
   })
 })`

function DatadogHeadTag() {
	return (
		<link rel="prefetch" href={__config.dev_dot.datadog_config.scriptUrl} />
	)
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
