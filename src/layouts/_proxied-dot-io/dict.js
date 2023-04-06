/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'

const productLayoutDict = {
	waypoint: dynamic(() => import('layouts/_proxied-dot-io/waypoint')),
	consul: dynamic(() => import('layouts/_proxied-dot-io/consul')),
	packer: dynamic(() => import('layouts/_proxied-dot-io/packer')),
	sentinel: dynamic(() => import('layouts/_proxied-dot-io/sentinel')),
	vagrant: dynamic(() => import('layouts/_proxied-dot-io/vagrant')),
	vault: dynamic(() => import('layouts/_proxied-dot-io/vault')),
}

export default productLayoutDict
