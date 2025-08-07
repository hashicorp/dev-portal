import type { RawRegistrationPageContent } from "views/certifications/content/schemas/registration-page"
import type { FaqItem } from "views/certifications/types"

export type CertificationRegistrationProps = {
    /**
     * Content for the page meta data, including title, footer info, and main CTA.
     * This content is validated against the RegistrationPageSchema.
     */
    jsonContent: RawRegistrationPageContent

    /**
     * Content for the info cards, parsed from the registration.mdx file.
     */
    mdxItems: FaqItem[]
}