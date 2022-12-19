import classNames from 'classnames'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import s from './mdx-heading-permalink.module.css'

export default function MdxHeadingPermalink(props) {
	const { className, level, href, 'aria-label': ariaLabel } = props

	return (
		<a
			className={classNames(s.root, className, s[`h${level}`])}
			aria-label={ariaLabel}
			href={href}
		>
			<IconLink16 className={s.icon} />
		</a>
	)
}
