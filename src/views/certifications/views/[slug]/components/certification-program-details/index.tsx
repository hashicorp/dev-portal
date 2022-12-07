import { MDXRemote } from 'next-mdx-remote'
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
} from 'components/dev-dot-content/mdx-components'
import { OverviewCard } from './components'
import {
	AccordionGroup,
	CertificationsContentArea,
} from 'views/certifications/components'
import s from './certification-program-details.module.css'

function MdxImage({
	alt,
	src,
	title,
}: Pick<ImageProps, 'alt' | 'src' | 'title'>) {
	return <Image alt={alt} src={src} title={title} noBorder={true} />
}
interface FaqItem {
	title: string
	mdxSource: $TSFixMe
}

export function CertificationProgramDetails({
	title,
	faqItems,
}: {
	title: string
	faqItems: FaqItem[]
}) {
	return (
		<>
			<div className={s.root}>
				<CertificationsContentArea>
					<div className={s.overviewCard}>
						<OverviewCard title={title} />
					</div>
					<h2 className={s.overviewHeading}>Overview</h2>
					<div className={s.overviewFaq}>
						<AccordionGroup
							items={faqItems.map((item: FaqItem) => {
								return {
									title: item.title,
									content: (
										<MDXRemote
											{...item.mdxSource}
											components={{
												a: MdxA,
												p: MdxP,
												table: MdxTable,
												img: MdxImage,
												inlineCode: MdxInlineCode,
												ul: MdxUnorderedList,
												ol: MdxOrderedList,
												li: MdxListItem,
											}}
										/>
									),
								}
							})}
						/>
					</div>
				</CertificationsContentArea>
			</div>
		</>
	)
}
