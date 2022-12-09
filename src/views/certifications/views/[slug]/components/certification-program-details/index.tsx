import { MDXRemote } from 'next-mdx-remote'
import Accordion from 'components/accordion'
import Image from 'components/image'
import { ImageProps } from 'components/image/types'
import {
	MdxA,
	MdxP,
	MdxTable,
	MdxInlineCode,
	MdxOrderedList,
	MdxUnorderedList,
	MdxListItem,
	MdxBlockquote,
} from 'components/dev-dot-content/mdx-components'
import { OverviewCard } from './components'
import {
	CertificationsContentArea,
	ExamBadgeSlug,
	GradientCardTheme,
} from 'views/certifications/components'
import s from './certification-program-details.module.css'

function MdxImage({
	alt,
	src,
	title,
}: Pick<ImageProps, 'alt' | 'src' | 'title'>) {
	return <Image alt={alt} src={src} title={title} noBorder={true} />
}

const MDX_COMPONENTS = {
	a: MdxA,
	blockquote: MdxBlockquote,
	p: MdxP,
	table: MdxTable,
	img: MdxImage,
	inlineCode: MdxInlineCode,
	ul: MdxUnorderedList,
	ol: MdxOrderedList,
	li: MdxListItem,
}
interface FaqItem {
	title: string
	mdxSource: $TSFixMe
}

export function CertificationProgramDetails({
	title,
	description,
	faqItems,
	links,
	productSlug,
	versionTested,
	slug,
}: {
	title: string
	description: string
	faqItems: FaqItem[]
	productSlug: ExamBadgeSlug
	versionTested: string
	slug: GradientCardTheme
	links?: {
		prepare?: string
		register?: string
	}
}) {
	return (
		<>
			<div className={s.root}>
				<CertificationsContentArea>
					<div className={s.overviewCard}>
						<OverviewCard
							title={title}
							description={description}
							links={links}
							productSlug={productSlug}
							versionTested={versionTested}
							slug={slug}
						/>
					</div>
					<h2 className={s.accordionHeading}>Overview</h2>
					<Accordion
						activatorHeadingLevel="h3"
						items={faqItems.map((item: FaqItem) => {
							return {
								title: item.title,
								content: (
									<MDXRemote {...item.mdxSource} components={MDX_COMPONENTS} />
								),
							}
						})}
					/>
				</CertificationsContentArea>
			</div>
		</>
	)
}
