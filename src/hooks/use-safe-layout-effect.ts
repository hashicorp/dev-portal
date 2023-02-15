/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useLayoutEffect } from 'react'

/**
 * An SSR-safe useLayoutEffect hook. Using `useLayoutEffect` inside a component which is
 * SSR'd throws a warning.
 */
const useSafeLayoutEffect =
	typeof window === 'undefined' ? useEffect : useLayoutEffect

export default useSafeLayoutEffect
