# Certifications Authorable Content

This folder contains all editable content for the HashiCorp Certifications pages.

- [Subnav](#subnav) — Controls the sub navigation bar labels and dropdowns across all Certifications pages
- [Landing Page](#landing-page) — `/certifications`
- [Exam Pages](#exam-pages) — `/certifications/<exam>` (e.g. `/certifications/terraform-associate`)
- [Sign In Page](#sign-in-page) — `/certifications/signin`

---

## Subnav

**File:** [`subnav.json`](./subnav.json)

This file controls the sub navigation bar that appears across all Certifications pages. It defines the link labels, top-level items, and dropdown selectors used to navigate between certification pages.

The top-level key is `certSubNavItems`, an array where each entry is either a **direct link** or a **dropdown group**.

### Direct link item

A flat link with no dropdown. Use this for top-level pages such as the Overview.

| Field   | Description                       |
| ------- | --------------------------------- |
| `label` | The text displayed in the nav bar |
| `url`   | The URL this item links to        |

**Example:**

```json
{
	"label": "Overview",
	"url": "/certifications"
}
```

### Dropdown group item

A labeled group that expands into a list of links when clicked. Use this to group related exam pages under a product heading.

| Field           | Description                                        |
| --------------- | -------------------------------------------------- |
| `label`         | The text shown on the dropdown trigger button      |
| `items`         | An array of link entries shown inside the dropdown |
| `items[].label` | The display text for each dropdown link            |
| `items[].path`  | The URL path each dropdown link navigates to       |

**Example:**

```json
{
	"label": "Terraform Certification",
	"items": [
		{
			"label": "Terraform Associate",
			"path": "/certifications/terraform-associate"
		},
		{
			"label": "Terraform Authoring and Operations Professional",
			"path": "/certifications/terraform-professional"
		}
	]
}
```

> **Note:** A subnav item must have either `url` (direct link) **or** `items` (dropdown), not both.

---

## Landing Page

**File:** [`landing.json`](./landing.json)

This file controls all content on the `/certifications` landing page.

### Hero

The `hero` object controls the banner at the top of the page.

| Field              | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| `hero.title`       | The main heading text                                                                |
| `hero.description` | The paragraph text beneath the heading                                               |

### Announcement banner

The `announcement` object controls the announcement banner that appears on the page.

| Field                  | Description                       |
| ---------------------- | --------------------------------- |
| `announcement.heading` | The bold heading in the banner    |
| `announcement.text`    | The supporting text in the banner |
| `announcement.cta`     | The link label                    |
| `announcement.ctaLink` | The URL the link points to        |

### Certification program listings

The `certificationPrograms` array controls the list of certification programs shown on the landing page. Each entry in the array represents one product group (e.g. Terraform, Vault).

| Field                  | Description                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product`              | The product name displayed as a heading for this group (e.g. `"Terraform"`)                                                                                                           |
| `containerDescription` | A short paragraph describing the certifications available for this product                                                                                                            |
| `certs`                | A list of exam IDs to display within this group. Each entry is an object with a single `id` field. IDs must match a card entry in [`exams/exam-cards.json`](./exams/exam-cards.json). |

**Example `certs` entry:**

```json
{ "id": "terraform-associate" }
```

---

## Exam Pages

Each exam has its own page at `/certifications/<exam>`. Content for each exam page is split across three types of files:

1. A **JSON file** in [`examPages/`](./examPages/) — controls most of the page's text content
2. An **objectives MDX file** in [`objectives/`](./objectives/) — controls the exam objectives section
3. A **recertifications MDX file** in [`recertifications/`](./recertifications/) — controls the recertification options section

The filename (without extension) must match the exam's ID in all three folders. For example, the Terraform Associate exam uses:

- `examPages/terraform-associate.json`
- `objectives/terraform-associate.mdx`
- `recertifications/terraform-associate.mdx`

Supported exam IDs are: `terraform-associate`, `terraform-professional`, `vault-associate`, `vault-professional`. More can be added in the future as new exams are launched.

---

### Exam page JSON (`examPages/<exam>.json`)

This file controls the majority of content on an exam page.

#### `title`

The name of the exam. Used as the page title.

#### `hero`

The banner at the top of the exam page.

| Field                | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------ |
| `hero.product`       | String for exam pages to indicate product & exam type (e.g. `"terraform-associate"`) |
| `hero.eyebrow`       | Small text above the main title (optional)                                           |
| `hero.title`         | The main heading                                                                     |
| `hero.description`   | The paragraph text beneath the heading                                               |
| `hero.leftCta.text`  | Label for the left call-to-action button (optional)                                  |
| `hero.leftCta.link`  | URL for the left call-to-action button (optional)                                    |
| `hero.rightCta.text` | Label for the right call-to-action button (optional)                                 |
| `hero.rightCta.link` | URL for the right call-to-action button (optional)                                   |

#### `announcement`

Controls the announcement banner on the exam page.

| Field                  | Description                       |
| ---------------------- | --------------------------------- |
| `announcement.header`  | The bold heading in the banner    |
| `announcement.text`    | The supporting text in the banner |
| `announcement.cta`     | The link label                    |
| `announcement.ctaLink` | The URL the link points to        |

#### `certificationDetails`

Controls the details section of the exam page.

| Field                                                       | Description                                                                                                                |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `certificationDetails.product`                              | The product this exam belongs to. Must be either `"terraform"` or `"vault"`.                                               |
| `certificationDetails.data.whoShouldTakeExam.title`         | Section heading (optional)                                                                                                 |
| `certificationDetails.data.whoShouldTakeExam.description`   | Paragraph describing who the exam is intended for                                                                          |
| `certificationDetails.data.examDetails.title`               | Section heading (optional)                                                                                                 |
| `certificationDetails.data.examDetails.details`             | A list of name/value pairs for exam logistics (e.g. format, duration, price). Each entry has a `name` and a `value` field. |
| `certificationDetails.data.prerequisites.title`             | Section heading (optional)                                                                                                 |
| `certificationDetails.data.prerequisites.prereqs`           | A list of prerequisite statements, each as a plain text string                                                             |
| `certificationDetails.data.prerequisites.bottomDescription` | Optional paragraph that appears below the prerequisites list                                                               |

**Example `details` entry:**

```json
{
	"name": "Duration",
	"value": "1 hour"
}
```

#### `objectives`

Controls the heading for the exam objectives section. The actual objectives content is authored in the matching file in [`objectives/`](./objectives/).

| Field              | Description                                 |
| ------------------ | ------------------------------------------- |
| `objectives.title` | The heading for the exam objectives section |

#### `renewCertifications`

Controls the heading and intro text for the recertification section. The detailed recertification options are authored in the matching file in [`recertifications/`](./recertifications/).

| Field                             | Description               |
| --------------------------------- | ------------------------- |
| `renewCertifications.title`       | The section heading       |
| `renewCertifications.description` | An introductory paragraph |

#### `linkWithImage`

Controls a featured link block (e.g. a link to the knowledge base).

| Field                       | Description                |
| --------------------------- | -------------------------- |
| `linkWithImage.title`       | The heading for the block  |
| `linkWithImage.description` | Supporting text            |
| `linkWithImage.cta`         | The link label             |
| `linkWithImage.ctaLink`     | The URL the link points to |

#### `relatedCertsFooter`

Controls the related certifications section at the bottom of the page.

| Field                            | Description                                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `relatedCertsFooter.title`       | The section heading                                                                                                                                                                   |
| `relatedCertsFooter.description` | Supporting text                                                                                                                                                                       |
| `relatedCertsFooter.certs`       | A list of exam IDs to display within this group. Each entry is an object with a single `id` field. IDs must match a card entry in [`exams/exam-cards.json`](./exams/exam-cards.json). |

**Example `certs` entry:**

```json
{ "id": "terraform-associate" }
```

---

### Exam objectives (`objectives/<exam>.mdx`)

This file contains the full exam objectives content, rendered in the objectives section of the exam page. Write content using standard Markdown. Each `## Heading Two` section will be used to populate a tab or expandable section.

---

### Recertifications (`recertifications/<exam>.mdx`)

This file contains the recertification scenarios and options, rendered in the "Renew Your Certification" section of the exam page. Content here is standard markdown.

---

## Exam Cards

**File:** [`exams/exam-cards.json`](./exams/exam-cards.json)

This file defines the card displayed for each exam when it is referenced by ID (e.g. on the landing page). Each card entry in the array represents one exam.

| Field         | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `id`          | A unique identifier for this exam.                                                                |
| `product`     | The product this exam belongs to. Must be `"terraform"` or `"vault"`.                             |
| `title`       | The exam name shown on the card                                                                   |
| `desc`        | A short description shown on the card                                                             |
| `starCount`   | A number indicating the level of the certification (e.g. `1` for Associate, `3` for Professional) |
| `ctaLink`     | The URL to the exam's detail page                                                                 |
| `certDetails` | A list of short bullet points shown on the card (e.g. product version tested, key skills)         |

---

## Sign In Page

**Files:** [`signin.json`](./signin.json) and [`signin.mdx`](./signin.mdx)

### Page text (`signin.json`)

This file controls the text content on the `/certifications/signin` page.

| Field                  | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `page_title`           | The main heading on the page                   |
| `main_cta_title`       | The heading on the primary call-to-action      |
| `main_cta_description` | Supporting text for the primary call-to-action |
| `main_cta_link_text`   | The link label for the primary call-to-action  |
| `main_cta_url`         | The URL for the primary call-to-action link    |
| `footer_title`         | The heading in the footer section              |
| `footer_description`   | Supporting text in the footer section          |
| `footer_cta`           | The link label in the footer section           |
| `footer_cta_url`       | The URL for the footer link                    |

### Info cards (`signin.mdx`)

Each `## Heading Two` section in this file generates one info card on the sign in page. Cards can contain:

- Plain text paragraphs
- Bullet lists
- `<Tooltip>` components with a `title` and `description` prop
