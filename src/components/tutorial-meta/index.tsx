import Heading from 'components/heading'
import { TutorialData } from 'views/tutorial-view'
import { Badges, getIsBeta } from './components'
import InteractiveLabButton from './components/interactive-lab-button'
import s from './tutorial-meta.module.css'

interface TutorialMetaProps {
	heading: { slug: string; text: string }
	meta: Pick<TutorialData, 'readTime' | 'edition' | 'productsUsed'> & {
		isInteractive: boolean
		hasVideo: boolean
	}
}

export default function TutorialMeta({ heading, meta }: TutorialMetaProps) {
	const { isInteractive, hasVideo, edition, productsUsed, readTime } = meta
	return (
		<header className={s.header}>
			<Heading
				level={1}
				size={500}
				weight="bold"
				id={heading.slug}
				className={s.heading}
			>
				{heading.text}
			</Heading>
			<div className={s.meta}>
				<Badges
					options={{
						readTime,
						isBeta: getIsBeta(productsUsed),
						products: productsUsed.map((p) => ({
							name: p.product.name,
							slug: p.product.slug,
						})),
						edition,
						hasVideo,
						isInteractive,
					}}
				/>
				<InteractiveLabButton />
			</div>
		</header>
	)
}
