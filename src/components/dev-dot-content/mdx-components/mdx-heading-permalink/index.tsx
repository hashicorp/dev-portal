import classNames from 'classnames'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import s from './mdx-heading-permalink.module.css'

export default function MdxHeadingPermalink(props) {
	const { className, ...rest } = props

	return (
		<a className={classNames(s.root, className)} {...rest}>
			<div className={s.icon}>
				<IconLink16 color="var(--token-color-foreground-faint)" />
			</div>
		</a>
	)
}
