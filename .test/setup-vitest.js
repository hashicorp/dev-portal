/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import '@testing-library/jest-dom/vitest'
import path from 'path'
import { unflatten } from 'flat'
import { getHashiConfig } from '../config'

const env = process.env.HASHI_ENV || 'development'
const envConfigPath = path.join(process.cwd(), 'config', `${env}.json`)

global.__config = unflatten(getHashiConfig(envConfigPath))

// Mock HTMLCanvasElement.getContext to prevent jsdom errors in tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => {
    // You can return a minimal mock object if needed
    return {};
  };
}
