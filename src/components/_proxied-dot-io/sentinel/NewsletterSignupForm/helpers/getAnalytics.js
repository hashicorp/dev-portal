import queryString from 'query-string'
import cookie from 'js-cookie'

/*
 *
 *  TEMPORARY
 *  This helper function replaces `ga-form-fields` in this component.
 *  We want to move this function into `js-utils` so it can be used elsewhere,
 *  make sure that we're accounting for other uses of `ga-form-fields`,
 *  and then remove the `ga-form-fields` component.
 *
 *  See Asana task: https://app.asana.com/0/1100423001970639/1135724610843042/f
 *
 */

function getAnalytics() {
  if (typeof window === 'undefined') return {}
  const qs = queryString.parse(window.location.search)
  return {
    utm_medium: qs.utm_medium || '',
    utm_campaign: qs.utm_campaign || '',
    utm_source: qs.utm_source || '',
    utm_term: qs.utm_term || '',
    utm_content: qs.utm_content || '',
    ga_campaign_id: '',
    leadSource: standardizeSource(qs.source),
    ga_client_id: getGAClientId(),
    munchkinCookie: cookie.get('_mkto_trk'),
    form_page_url: window.location.toString(),
  }
}

function getGAClientId() {
  return (cookie.get('_ga') || '').replace(/GA\d\.\d\./, '')
}

function standardizeSource(sourceValue) {
  switch (sourceValue) {
    case 'linkedin':
      return 'LinkedIn Paid'
    default:
      return 'Website'
  }
}

export default getAnalytics
