import { useEffect } from 'react'
import { isInUS } from '@hashicorp/platform-util/geo'
import { useFlags } from 'flags/client'
import { abTestTrack } from 'lib/ab-test-track'

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
