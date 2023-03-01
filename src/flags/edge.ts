/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { createGetEdgeFlags } from '@happykit/flags/edge'
import { type AppFlags, config } from './config'

export const getEdgeFlags = createGetEdgeFlags<AppFlags>(config)
