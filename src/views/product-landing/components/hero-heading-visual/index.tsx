import { CSSProperties } from 'react'
import { HeroHeadingVisualProps } from './types'
import s from './hero-heading-visual.module.css'

function HeroHeadingVisual({
	heading,
	image,
	productSlug,
}: HeroHeadingVisualProps) {
	const gradientDefault = {
		start: `var(--token-color-palette-neutral-100)`,
		stop: `var(--token-color-palette-neutral-50)`,
	}
	const gradient =
		productSlug && productSlug !== 'hcp'
			? {
					start: `var(--token-color-${productSlug}-gradient-faint-start)`,
					stop: `var(--token-color-${productSlug}-gradient-faint-stop)`,
			  }
			: gradientDefault

	return (
		<div
			className={s.root}
			style={
				{
					'--gradient-start': gradient.start,
					'--gradient-stop': gradient.stop,
				} as CSSProperties
			}
		>
			<h1 className={s.heading}>{heading}</h1>
			<div className={s.image}>
				<img src={image} alt="" />
			</div>
		</div>
	)
}

export { HeroHeadingVisual }
export default HeroHeadingVisual
