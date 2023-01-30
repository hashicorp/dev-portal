import { useEffect } from 'react'
import { isInUS } from '@hashicorp/platform-util/geo'
import { useFlags } from 'flags/client'
import { abTestTrack } from 'lib/ab-test-track'

const ctaSuffix = 'for free'

export function useABTestCta(ctaText: string) {
	const { flags } = useFlags()
	const flag = flags?.tryCloudFreeCta || false

	let final = ctaText

	if (isInUS() && flag && !ctaText.endsWith(ctaSuffix)) {
		final = `${ctaText} ${ctaSuffix}`
	}

	useEffect(() => {
		abTestTrack({
			type: 'Served',
			test_name: 'HCP CTA Trial 2023-02',
			variant: flag.toString(),
		})
	}, [flag])

	return final
}
