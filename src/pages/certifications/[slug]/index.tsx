/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import CertificationProgramView from 'views/certifications/views/[slug]'
import {
	getStaticPaths,
	getStaticProps,
} from 'views/certifications/views/[slug]/server'

export { getStaticPaths, getStaticProps }

export default CertificationProgramView
