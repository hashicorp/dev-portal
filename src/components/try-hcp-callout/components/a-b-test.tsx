import { useFlags } from 'flags/client'

const ctaSuffix = 'for free'

export function useABTestCta(ctaText: string) {
	// use the flag here
	const { flags } = useFlags()
	let final = ctaText

	if (flags?.tryCloudFreeCta && !ctaText.endsWith(ctaSuffix)) {
		final = `${ctaText} ${ctaSuffix}`
	}

	return final
}
