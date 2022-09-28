import { useEffect, useLayoutEffect } from 'react'
import { isBrowser } from 'lib/is-browser'

export const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect
