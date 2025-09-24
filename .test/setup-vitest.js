/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import '@testing-library/jest-dom/vitest'
import { unflatten } from 'flat'
import { loadHashiConfigForEnvironment } from '../config'

global.__config = unflatten(loadHashiConfigForEnvironment())
