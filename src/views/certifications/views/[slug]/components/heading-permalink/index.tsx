import slugify from 'slugify'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import s from './heading-permalink.module.css'

export function HeadingPermalink({ heading }: { heading: string }) {
	const id = `${slugify(heading, {
		lower: true,
	})}`
	return (
		<h2 className={s.heading} id={id}>
			<a className={s.anchorLink} href={`#${id}`}>
				{heading}
				<IconLink16 className={s.icon} />
			</a>
		</h2>
	)
}
