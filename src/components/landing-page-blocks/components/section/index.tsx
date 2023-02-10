import { ReactNode } from 'react'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './section.module.css'

interface SectionProps {
	heading: string
	subheading?: string
	children: ReactNode
}

const Section = ({ heading, subheading, children }: SectionProps) => {
	return (
		<section>
			<div className={s.textWrapper}>
				<Heading className={s.heading} level={2} size={400} weight="bold">
					{heading}
				</Heading>
				{subheading ? (
					<Text
						asElement="p"
						className={s.subheading}
						size={300}
						weight="regular"
					>
						{subheading}
					</Text>
				) : null}
			</div>
			{children}
		</section>
	)
}

export type { SectionProps }
export { Section }
