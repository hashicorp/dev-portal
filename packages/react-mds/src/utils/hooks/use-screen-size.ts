import { useMediaQuery } from '@web/hooks/use-media-query'

// ref: https://github.com/hashicorp/web/blob/main/packages/mds-tokens/src/custom-media.css
const useSmall = () => useMediaQuery('(max-width: 768px)')
const useMedium = () =>
	useMediaQuery('(min-width: 768px) and (max-width: 1119px)')
const useMediumUp = () => useMediaQuery('(min-width: 768px)')
const useLarge = () => useMediaQuery('(min-width: 1120px)')

export { useSmall, useMedium, useMediumUp, useLarge }
