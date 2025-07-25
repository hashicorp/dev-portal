# Certifications Authorable Content

This folder contains the authorable content for Certifications pages.

- [Landing Page](#landing-page), at `/certifications`
  - Visit [/certifications](https://developer.hashicorp.com/certifications)
- [Program Pages](#program-pages), at `/certifications/<program>`
  - Visit for example [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation)
- [Registration Page](#registration-page), at `/certifications/registration`
  - Visit [/certifications/registration](https://developer.hashicorp.com/certifications/registration)

## Landing Page

### Hero

The content for the landing page hero is managed in [content/certifications/landing.json](/src/content/certifications/landing.json).

### Program Summaries

The `programSummaryOrder` array allows authors to control which programs are summarized on the landing page, and in what order those summaries appear. The content for program summaries on the landing page is driven by [content for each Program Page](#program-pages).

### FAQs

The heading for the FAQ section on the landing page is managed by the `faqHeading` property in [content/certifications/landing.json](/src/content/certifications/landing.json).

The content for the landing page's FAQ content is managed in [content/certifications/landing-faq.mdx](/src/content/certifications/landing-faq.mdx). FAQs are derived from this MDX file by extracting title text and content from each `## Heading Two` section.

## Program Pages

Program pages at `/certifications/<slug>` are rendered based on the `<slug>.json` files present in the [content/certifications/programs](/src/content/certifications/programs) directory.

Each `<slug>.json` file in that directory controls the content for an individual program page. For example, [content/certifications/programs/security-automation.json](/src/content/certifications/programs/security-automation.json) controls the content for [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation).

### Copy for Programs and Exams

Most copy on program pages, including copy related to individual exams, is managed directly in each `<slug>.json` file. Details on the content schema can be found in [src/views/certifications/content/schemas/certification-program.ts](/src/views/certifications/content/schemas/certification-program.ts).

### Exam FAQs on Program Pages

Each program page can specific one or many exams, in the `exams` array in each `<slug>.json` file.

Each exam must reference an `.mdx` document within the `src/content/certifications/exam-faqs` directory, where FAQ content for each exam is authored. FAQs are derived from MDX files by extracting the FAQ title text and content from each `## Heading Two` section.

For example, on the [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation) we can see the exam FAQs for the `Vault Associate 002` exam. These FAQs are authored in [src/content/certifications/exam-faqs/vault-associate-002.mdx](/src/content/certifications/exam-faqs/vault-associate-002.mdx). This filepath is specified in the associated `exams` array item, specifically using the `faqSlug` attribute on the `Vault Associate 002` exam item within [src/content/certifications/programs/vault.json](/src/content/certifications/programs/vault.json).

## Registration Page

The registration page is rendered based on the `registration.json` and `registration.mdx` files.

### Page metadata

The content for the page header and footer is from the `registration.json` file. It contains the `page_title`, `footer_title`, `footer_description`, and `footer_cta` categories. 

### Copy for info cards

Each info card is generated from each `## Heading Two` section in the `registration.mdx` file. Each section can contain a title, plain text content, bullets, info boxes, and call to actions.
