/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import dynamic from 'next/dynamic'

const productLayoutDict = {
	boundary: dynamic(() => import('layouts/_proxied-dot-io/boundary')),
	waypoint: dynamic(() => import('layouts/_proxied-dot-io/waypoint')),
	consul: dynamic(() => import('layouts/_proxied-dot-io/consul')),
	nomad: dynamic(() => import('layouts/_proxied-dot-io/nomad')),
	packer: dynamic(() => import('layouts/_proxied-dot-io/packer')),
	sentinel: dynamic(() => import('layouts/_proxied-dot-io/sentinel')),
	vagrant: dynamic(() => import('layouts/_proxied-dot-io/vagrant')),
	vault: dynamic(() => import('layouts/_proxied-dot-io/vault')),
}

export default productLayoutDict
