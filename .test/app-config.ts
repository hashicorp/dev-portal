/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { unflatten } from 'flat'
import { loadHashiConfigForEnvironment } from '../config'

export const __config = unflatten(loadHashiConfigForEnvironment())
