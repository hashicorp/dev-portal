/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import Script from 'next/script'

const COMMIT_SHA = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
const ENV = process.env.HASHI_ENV || 'development'

const instanaBootstrapScriptBody = `(function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
	n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");
ineum('reportingUrl','${__config.dev_dot.instana_config.reportingUrl}');
ineum('key','${__config.dev_dot.instana_config.key}');
ineum('meta','env','${ENV}');
${COMMIT_SHA ? `ineum('meta','version','${COMMIT_SHA}');` : ''}
ineum('trackSessions');
ineum('autoPageDetection', true);
ineum('ignoreErrorMessages', [/extension/i, /node_modules/i]);`

function InstanaHeadTag() {
	return (
		<link rel="preconnect" href={__config.dev_dot.instana_config.reportingUrl} />
	)
}

function InstanaScriptTag() {
	return (
		<>
			<Script
				id="instana-bootstrap-script"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: instanaBootstrapScriptBody,
				}}
			/>
			<Script
				id="instana-loader-script"
				src={__config.dev_dot.instana_config.scriptUrl}
				strategy="afterInteractive"
				crossOrigin="anonymous"
				integrity={__config.dev_dot.instana_config.scriptIntegrity}
			/>
		</>
	)
}

export { InstanaHeadTag, InstanaScriptTag, instanaBootstrapScriptBody }
