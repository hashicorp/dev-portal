/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import {
    getFaqsFromMdx,
} from 'views/certifications/content/utils'
import { SignInPageSchema } from 'views/certifications/content/schemas/signin-page'

const CONTENT_DIR = 'src/content/certifications'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps() {
    /**
     * Ensure the authored content matches our expected schema
     */
    const signInJsonContentString = readLocalFile(path.join(CONTENT_DIR, 'signin.json'))
    const jsonContent = SignInPageSchema.parse(JSON.parse(signInJsonContentString))

    /**
     * Parse info card sections from an MDX file
     */
    const signInMdxString = readLocalFile(path.join(CONTENT_DIR, 'signin.mdx'))
    const mdxItems = await getFaqsFromMdx(signInMdxString)

    /**
     * Return static props
     */
    return {
        props: {
            jsonContent,
            mdxItems,
            metadata: { title: 'Certifications Sign In', localOgImage: 'certifications.jpg' },
        },
    }
}
