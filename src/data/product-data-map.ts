/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { ProductData } from 'types/products'
import boundaryData from 'data/boundary.json'
import consulData from 'data/consul.json'
import hcpData from 'data/hcp.json'
import nomadData from 'data/nomad.json'
import packerData from 'data/packer.json'
import sentinelData from 'data/sentinel.json'
import terraformData from 'data/terraform.json'
import vagrantData from 'data/vagrant.json'
import vaultData from 'data/vault.json'
import waypointData from 'data/waypoint.json'

export const PRODUCT_DATA_MAP = {
	boundary: boundaryData,
	consul: consulData,
	hcp: hcpData,
	nomad: nomadData,
	packer: packerData,
	sentinel: sentinelData,
	terraform: terraformData,
	vagrant: vagrantData,
	vault: vaultData,
	waypoint: waypointData,
} as Record<string, ProductData>
