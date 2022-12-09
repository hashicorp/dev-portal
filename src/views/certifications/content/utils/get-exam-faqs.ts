import fs from 'fs'
import path from 'path'
import { FaqItem } from 'views/certifications/types'
import {
	collectMdContentByHeading,
	ContentSection,
} from './collect-md-content-by-heading'
import { serialize } from 'next-mdx-remote/serialize'

const EXAM_CONTENT_DIR = 'src/content/certifications/exam-faqs'

/**
 * Given an exam slug,
 * Return an array of FAQ items, sourced from an .mdx file for the exam.
 */
export async function getExamFaqs(examSlug: string): Promise<FaqItem[]> {
	// Get the full file path to the FAQ markdown
	const fileName = `${examSlug}.mdx`
	const fullPath = path.join(process.cwd(), EXAM_CONTENT_DIR, fileName)
	// Read in the MDX source
	const mdxString = fs.readFileSync(fullPath, 'utf8')
	// Sort MDX source into heading sections
	const contentSections = await collectMdContentByHeading(mdxString)
	// Format into FAQ items
	const faqItems = await Promise.all(
		contentSections.map(async ({ title, content }: ContentSection) => {
			return { title, mdxSource: await serialize(content) }
		})
	)
	return faqItems
}
