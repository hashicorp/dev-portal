/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { RawSignInPageContent } from "views/certifications/content/schemas/signin-page"
import type { FaqItem } from "views/certifications/types"

export type CertificationSignInProps = {
    /**
     * Content for the page meta data, including title, footer info, and main CTA.
     * This content is validated against the SignInPageSchema.
     */
    jsonContent: RawSignInPageContent

    /**
     * Content for the info cards, parsed from the signin.mdx file.
     */
    mdxItems: FaqItem[]
}