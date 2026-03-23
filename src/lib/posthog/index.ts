import { PostHog } from 'posthog-node'
import { v4 as uuidv4 } from 'uuid'
import type { NextRequest, NextResponse } from 'next/server'
import Cookies from 'js-cookie'
import { GetServerSidePropsContext } from 'next'

// Types

type GetServerSidePropsRequest = GetServerSidePropsContext['req']
type PosthogRequest = NextRequest | GetServerSidePropsRequest | null
type FeatureFlags = Record<string, string | boolean>
type BootstrapData = {
	distinctID: string
	featureFlags: FeatureFlags
}

// Enums

enum DatagrailPerfCookieConsent {
	Consented = 'consented',
	NotConsented = 'not-consented',
	Undecided = 'undecided',
}

// Constants

/**
 * US states that require users to manually opt-in to cookies
 * at the time of writng, we at hashicorp treat CA + OR as opt in, CCPA and CPRA don't "yet" require this
 * this is following guidance from our legal team, since the laws are likely to require this in the near future
 */
const OPT_IN_STATES = ['OR', 'CA']
const POSTHOG_BOOTSTRAP_COOKIE_KEY = 'ph_bootstrap_data'
const POSTHOG_COOKIE_KEY = `ph_${process.env.POSTHOG_PROJECT_API_KEY}_posthog`

//#region Consent Utils

/**
 * Parses the `hc_geo` cookie value into a country and region.
 *
 * @param rawGeo - The raw value of the `hc_geo` cookie.
 * @returns An object containing the country and region, or null if not available.
 */
const parseGeoCookie = (rawGeo: string | null) => {
    if (!rawGeo) return { country: null, region: null }

    const [countryPart, regionPart] = rawGeo.split(',')
    const country = countryPart?.split('=')[1]?.toUpperCase() ?? null
    const region = regionPart?.split('=')[1]?.toUpperCase() ?? null

    return { country, region }
}

/**
 * Normalizes a header value to a single string.
 *
 * @param value - The value of the header, which can be a string, an array of strings, or undefined.
 * @returns The first header value if it's an array, the value itself if it's a string, or null if undefined.
 */
const normalizeHeader = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) return value[0] ?? null
    return value ?? null
}

/**
 * Retrieves the geographic information (country and region) of the user from the request.
 * This works for both middleware requests and getServerSideProps requests.
 *
 * @param req - The request object from middleware or getServerSideProps
 * @returns An object containing the country and region, or null if not available.
 */
const getGeo = (req: PosthogRequest) => {
    let rawGeo: string | null = null

    if (isMiddlewareRequest(req)) {
        rawGeo = req.cookies.get('hc_geo')?.value ?? null
    } else if (isGetServerSidePropsRequest(req)) {
        rawGeo = (req.cookies['hc_geo'] as string | undefined) ?? null
    }

    const cookieGeo = parseGeoCookie(rawGeo)
    if (cookieGeo.country && cookieGeo.region) return cookieGeo

    // First request in preview may not have hc_geo yet; use request geo headers.
    if (isMiddlewareRequest(req)) {
        return {
            country: req.headers.get('x-vercel-ip-country')?.toUpperCase() ?? null,
            region:
                req.headers.get('x-vercel-ip-country-region')?.toUpperCase() ?? null,
        }
    }

    if (isGetServerSidePropsRequest(req)) {
        const country =
            normalizeHeader(req.headers['x-vercel-ip-country'])?.toUpperCase() ??
            null
        const region =
            normalizeHeader(req.headers['x-vercel-ip-country-region'])?.toUpperCase() ??
            null
        return { country, region }
    }

    return { country: null, region: null }
}

/**
 * Determines if a user can be made to opt-out by default. (ie can we set cookies without explicit consent and then allow the user to opt-out later)
 * If null is passed, we rely on the middleware to set the `hc_geo` cookie via {@link https://github.com/hashicorp/web-platform-packages/blob/27b748c6d2769c417aeb7aa48485c0ebd4dcbc26/packages/edge-utils/lib/set-geo-cookie.ts#L22 setGeoCookie},
 * which contains the user's country and region information.
 *
 * @param req - The request object from middleware or getServerSideProps
 * @returns boolean indicating if the user can be made to opt-out by default
 */
const canUseOptOutPolicy = (req: PosthogRequest): boolean => {
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
        return true
    }

    const { country, region } = getGeo(req)

    // If we can't determine country or it's not US, require explicit opt-in
    if (!country || country !== 'US') return false

    // If we can't determine region, require explicit opt-in
    if (!region) return false

    const isOptInState = OPT_IN_STATES.includes(region)
    return !isOptInState
}

/**
 * Sets the performance consent status based on the user's consent preferences.
 * 
 * @param req - The request object from middleware or getServerSideProps
 * @returns The performance consent status as a {@link DatagrailPerfCookieConsent} enum value
 */
const getPerfConsentStatus = (req: PosthogRequest) => {
	let consentCookie = null,
		consentPreferences = null
	if (isMiddlewareRequest(req)) {
		consentCookie = req.cookies.get('datagrail_consent_preferences')
		consentPreferences = consentCookie?.value
	} else if (isGetServerSidePropsRequest(req)) {
		consentCookie = req.cookies['datagrail_consent_preferences']
		consentPreferences = consentCookie
	}

	if (!consentPreferences) {
		return DatagrailPerfCookieConsent.Undecided
	}

	return consentPreferences.includes('dg-category-performance:1')
		? DatagrailPerfCookieConsent.Consented
		: DatagrailPerfCookieConsent.NotConsented
}

/**
 * Determines whether PostHog can be used based on user consent and regional policies.
 *
 * @param req - The request object from middleware or getServerSideProps
 * @returns boolean indicating whether PostHog can be used based on consent and regional policies
 */
const canUsePosthog = (req: PosthogRequest): boolean => {
	const perfConsentStatus = getPerfConsentStatus(req)

	const hasExplicitConsent =
		perfConsentStatus === DatagrailPerfCookieConsent.Consented
	if (hasExplicitConsent) return true
	const hasExplicitOptOut =
		perfConsentStatus === DatagrailPerfCookieConsent.NotConsented
	if (hasExplicitOptOut) return false

	const isOptOutAllowed = canUseOptOutPolicy(req)

	const canAutoAttachCookies =
		perfConsentStatus === DatagrailPerfCookieConsent.Undecided &&
		isOptOutAllowed

	return canAutoAttachCookies
}

//#endregion Consent Utils

/**
 * Retrieves the parsed PostHog cookie from the request.
 * 
 * @param req - The request object from middleware or getServerSideProps
 * @returns The parsed PostHog cookie object, or null if the cookie is not present
 */
const getParsedPosthogCookie = async (req: PosthogRequest) => {
	let cookie = null
	if (isMiddlewareRequest(req)) {
		cookie = req.cookies.get(POSTHOG_COOKIE_KEY)
	} else if (isGetServerSidePropsRequest(req)) {
		cookie = req.cookies[POSTHOG_COOKIE_KEY]
	}

	if (cookie && cookie.value) {
		return JSON.parse(cookie.value)
	} else if (cookie) {
		return JSON.parse(cookie)
	} else {
		return null
	}
}

/**
 * Retrieves PostHog bootstrap data (distinct ID and feature flag data).
 * https://posthog.com/tutorials/nextjs-ab-tests#5-bootstrapping-feature-flags
 *
 * This function attempts to fetch the parsed PostHog cookie and extracts the `distinctID`.
 * If the cookie does not contain a `distinctID`, a new one is generated. It then uses the
 * PostHog client to fetch all feature flags associated with the `distinctID`. The function
 * returns an object containing the `distinctID` and the feature flags.
 * 
 * @param req - The request object from middleware or getServerSideProps
 * @returns An object containing the `distinctID` and the feature flags
 */
async function getBootstrapData(req: PosthogRequest) {
	let distinctID = ''
	const cookie = await getParsedPosthogCookie(req)

	if (cookie) {
		distinctID = cookie.distinct_id
	}

	if (!distinctID) {
		distinctID = uuidv4()
	}

	let bootstrapCookie = null, hasExistingBootstrapData = false
	if(isMiddlewareRequest(req)) {
		bootstrapCookie = req.cookies.get(POSTHOG_BOOTSTRAP_COOKIE_KEY)
		hasExistingBootstrapData = !!bootstrapCookie && bootstrapCookie.value
	} else if (isGetServerSidePropsRequest(req)) {
		bootstrapCookie = req.cookies[POSTHOG_BOOTSTRAP_COOKIE_KEY]
		hasExistingBootstrapData = !!bootstrapCookie
	}

	if (hasExistingBootstrapData) {
		const bootstrapData = parseBootstrapData(
			bootstrapCookie.value ?? bootstrapCookie
		)
		return bootstrapData
	}

	const client = new PostHog(process.env.POSTHOG_PROJECT_API_KEY, {
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	})

	const flags = await client.getAllFlags(distinctID)

	const bootstrap: BootstrapData = {
		distinctID,
		featureFlags: flags,
	}

	return bootstrap
}

/**
 * Retrieves the value of a specific feature flag for the given request.
 * Used this function in getServerSideProps for a page. This function also logs the feature flag call to PostHog.
 * 
 * @param flag - The name of the feature flag to retrieve
 * @param req - The request object from getServerSideProps
 * @returns The value of the feature flag, or null if the flag is not available or PostHog cannot be used
 */
export const getFeatureFlag = async (
	flag: string,
	req: GetServerSidePropsRequest
) => {
	if (!canUsePosthog(req)) return null
	const bootstrapData = await getBootstrapData(req)
	if (!bootstrapData) return null
	const { featureFlags } = bootstrapData

	const isObj = typeof featureFlags === 'object'
	if (!isObj) return null

	const client = new PostHog(process.env.POSTHOG_PROJECT_API_KEY, {
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	})

	client.capture({
		distinctId: bootstrapData.distinctID,
		event: '$feature_flag_called',
		properties: {
			$feature_flag: flag,
			$feature_flag_response: featureFlags[flag],
		},
	})

	return featureFlags ? featureFlags[flag] : null
}

/**
 * Sets the PostHog feature flag cookies on the response object. This function is called in the middleware.
 * 
 * @param req The request object from middleware
 * @param res The response object from middleware
 * @returns The response object with bootstrap cookie set if posthog can be used
 */
export const setPosthogFeatureFlagCookies = async (
	req: NextRequest,
	res: NextResponse
) => {
	if (!canUsePosthog(req)) return res

	const bootstrapData = await getBootstrapData(req)
	const jsonData = JSON.stringify(bootstrapData)
	const isDev = process.env.NODE_ENV === 'development'
	if (isDev) {
		console.log(`bootstrapped feature flag data: ${jsonData}`)
	}
	// The cookie needs to expire at some point otherwise users will never get
	// updated bootstrap data and therefore never be included in future experiments.
	const expires = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days
	res.cookies.set(POSTHOG_BOOTSTRAP_COOKIE_KEY, jsonData, {
		expires,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})
	return res
}

/**
 * Helped function to parse the bootstrap data from a JSON string.
 * 
 * @param jsonData The data to be parsed as a JSON string
 * @returns The parsed data
 */
const parseBootstrapData = (jsonData: string) => {
	try {
		return JSON.parse(jsonData)
	} catch (e) {
		return null
	}
}

/**
 * Retrieves the bootstrap data from the client-side cookies.
 * This function is called when posthog is initialized so the bootstrap data is available.
 * 
 * @returns The parsed bootstrap data, or null if not available
 */
export const getBootstrapDataClient = () => {
	const maybeBootstrapData = Cookies.get(POSTHOG_BOOTSTRAP_COOKIE_KEY)
	return parseBootstrapData(maybeBootstrapData)
}

/**
 * Helper function to determine if the request is a Next.js middleware request.
 * 
 * @param req The request object to check
 * @returns True if the request is a Next.js middleware request, false otherwise
 */
function isMiddlewareRequest(req: PosthogRequest): req is NextRequest {
	// NextRequest has a .cookies.get method
	return typeof req?.cookies?.get === 'function'
}

/**
 * Helper function to determine if the request is a Next.js getServerSideProps request.
 * 
 * @param req The request object to check
 * @returns True if the request is a Next.js getServerSideProps request, false otherwise
 */
function isGetServerSidePropsRequest(
	req: PosthogRequest
): req is GetServerSidePropsRequest {
	// Node.js IncomingMessage has .cookies as an object, not a function
	return (
		req &&
		typeof req?.cookies === 'object' &&
		typeof req?.cookies.get !== 'function'
	)
}
