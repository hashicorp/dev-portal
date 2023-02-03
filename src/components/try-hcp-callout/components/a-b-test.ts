import { useEffect } from 'react'
import { isInUS } from '@hashicorp/platform-util/geo'
import { useFlags } from 'flags/client'
import { abTestTrack } from 'lib/ab-test-track'

/**
 * This hook is for the HCP CTA Trial 2023-02 AB test
 *
 * TODO: Remove once the test is over, along with the calls in
 * ./try-hcp-callout-compact & ./try-hcp-callout-prebuilt
 *
 * Note: when running AB tests in the future, we should only
 * call `useFlags` at the app or layout level and passing that data
 * down. At the time of running there are no other active tests.
 */

const ctaSuffix = 'for free'

export function useABTestCta(ctaText: string): string {
	const { flags, settled } = useFlags()
	const flag = flags?.tryCloudFreeCta || false

	let finalText = ctaText

	if (isInUS() && flag && !ctaText.endsWith(ctaSuffix)) {
		finalText = `${ctaText} ${ctaSuffix}`
	}

	useEffect(() => {
		if (settled) {
			abTestTrack({
				type: 'Served',
				test_name: 'HCP CTA Trial 2023-02',
				variant: flag.toString(),
			})
		}
	}, [flag, settled])

	return finalText
}
