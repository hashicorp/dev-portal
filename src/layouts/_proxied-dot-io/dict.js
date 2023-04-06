/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'

const productLayoutDict = {
	waypoint: dynamic(() => import('layouts/_proxied-dot-io/waypoint')),
	consul: dynamic(() => import('layouts/_proxied-dot-io/consul')),
	nomad: dynamic(() => import('layouts/_proxied-dot-io/nomad')),
	packer: dynamic(() => import('layouts/_proxied-dot-io/packer')),
	sentinel: dynamic(() => import('layouts/_proxied-dot-io/sentinel')),
	vault: dynamic(() => import('layouts/_proxied-dot-io/vault')),
}

export default productLayoutDict
