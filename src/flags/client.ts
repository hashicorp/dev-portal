/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	createUseFlags,
	type InitialFlagState as GenericInitialFlagState,
} from '@happykit/flags/client'
import { createUseFlagBag, FlagBagProvider } from '@happykit/flags/context'
import { type AppFlags, config } from './config'

export type InitialFlagState = GenericInitialFlagState<AppFlags>
export const useFlags = createUseFlags<AppFlags>(config)
export const useFlagBag = createUseFlagBag<AppFlags>()
export { FlagBagProvider }
