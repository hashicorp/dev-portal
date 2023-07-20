/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'

type Handler = Parameters<NextRouter['events']['on']>[1]

interface UseOnRouteChangeStartOptions {
	handler: Handler
	shouldListen?: boolean
}

/**
 * If `shouldListen` is true, then handles adding a `routeChangeStart` listener
 * that executes the given `handler`.
 */
const useOnRouteChangeStart = ({
	handler,
	shouldListen = true,
}: UseOnRouteChangeStartOptions) => {
	return
	const router = useRouter()

	useEffect(() => {
		if (!shouldListen) {
			return
		}

		router.events.on('routeChangeStart', handler)

		return () => {
			router.events.off('routeChangeStart', handler)
		}
	}, [handler, router.events, shouldListen])
}

export type { UseOnRouteChangeStartOptions }
export default useOnRouteChangeStart
