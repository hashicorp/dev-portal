/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { getStaticPathsWithVersion as getStaticPaths } from 'views/product-integration/readme-view/server'
import WaypointIntegrationReadmeView, { getStaticProps } from '../index'

/**
 * At time of archival there are no waypoint integrations with additional
 * versions beyond current 'latest'. This view shouldn't be hit since
 * the integrations won't likely be updated in the future.
 *
 * This is copied over for consistency and in the rare event that a version
 * is added in the future for a legacy waypoint integration.
 */

export { getStaticPaths, getStaticProps }
export default WaypointIntegrationReadmeView
