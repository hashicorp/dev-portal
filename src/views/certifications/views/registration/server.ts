/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import {
    getFaqsFromMdx,
} from 'views/certifications/content/utils'

const CONTENT_DIR = 'src/content/certifications'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps() {
    /**
     * Ensure the authored content matches our expected schema
     */
    const registrationJsonContentString = readLocalFile(path.join(CONTENT_DIR, 'registration.json'))
    // TODO: add a schema for this content
    // const pageContent = RegistrationPageSchema.parse(JSON.parse(registrationJsonContentString))
    const jsonContent = JSON.parse(registrationJsonContentString)

    /**
     * Parse landing page FAQs from an MDX file
     */
    const registrationMdxString = readLocalFile(path.join(CONTENT_DIR, 'registration.mdx'))
    const mdxItems = await getFaqsFromMdx(registrationMdxString)

    /**
     * Return static props
     */
    return {
        props: {
            jsonContent,
            mdxItems,
            metadata: { title: 'Certifications', localOgImage: 'certifications.jpg' },
        },
    }
}
