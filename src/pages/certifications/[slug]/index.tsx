/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import CertificationProgramView from 'views/certifications/views/[slug]'
import {
	getStaticPaths,
	getStaticProps,
} from 'views/certifications/views/[slug]/server'

export { getStaticPaths, getStaticProps }

export default CertificationProgramView
