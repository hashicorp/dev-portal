# Certifications Authorable Content

This folder contains the authorable content for Certifications pages.

- [Landing Page](#landing-page), at `/certifications`
  - Visit [/certifications](https://developer.hashicorp.com/certifications)
- [Program Pages](#program-pages), at `/certifications/<program>`
  - Visit for example [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation)

## Landing Page

### Hero

The content for the landing page hero is managed in [content/certifications/landing.json](/src/content/certifications/landing.json).

## Program Pages

Program pages at `/certifications/<slug>` are rendered based on the `<slug>.json` files present in the [content/certifications/programs](/src/content/certifications/programs) directory.

Each `<slug>.json` file in that directory controls the content for an individual program page. For example, [content/certifications/programs/security-automation.json](/src/content/certifications/programs/security-automation.json) controls the content for [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation).

### Copy on Program Pages

Most copy on program pages is managed directly in each `<slug>.json` file. Details on the content schema can be found in [src/views/certifications/content/schemas/certification-program.ts](/src/views/certifications/content/schemas/certification-program.ts).

### Exam FAQs on Program Pages

Each program page can specific one or many exams, in the `exams` array in each `<slug>.json` file.

Each exam must reference an `.mdx` document within the `src/content/certifications/exam-faqs` directory, where FAQ content for each exam is authored. FAQs are derived from MDX files by extracting the FAQ title text and content from each `## Heading Two` section.

For example, on the [/certifications/security-automation](https://developer.hashicorp.com/certifications/security-automation) we can see the exam FAQs for the `Vault Associate 002` exam. These FAQs are authored in [src/content/certifications/exam-faqs/vault-associate-002.mdx](/src/content/certifications/exam-faqs/vault-associate-002.mdx). This filepath is specified in the associated `exams` array item, specifically using the `faqSlug` attribute on the `Vault Associate 002` exam item within [src/content/certifications/programs/vault.json](/src/content/certifications/programs/vault.json).
