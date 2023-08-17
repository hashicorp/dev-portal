/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'

const productLayoutDict = {
	sentinel: dynamic(() => import('layouts/_proxied-dot-io/sentinel')),
}

export default productLayoutDict
