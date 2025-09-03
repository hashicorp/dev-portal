/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'

/**
 * Content schema for the /certifications/signin page.
 *
 */
export const SignInPageSchema = z.object({
    page_title: z.string(),
    main_cta_title: z.string(),
    main_cta_description: z.string(),
    main_cta_url: z.string(),
    main_cta_link_text: z.string(),
    footer_title: z.string(),
    footer_description: z.string(),
    footer_cta: z.string(),
    footer_cta_url: z.string(),
})

/**
 * Raw content for the certification sign in page.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawSignInPageContent = z.infer<typeof SignInPageSchema>
