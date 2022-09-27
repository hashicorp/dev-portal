import classNames from 'classnames'
import { IconLink16 } from '@hashicorp/flight-icons/svg-react/link-16'
import Tooltip from 'components/tooltip'
import s from './mdx-heading-permalink.module.css'

export default function MdxHeadingPermalink(props) {
	const { className, ...rest } = props

	function copyLinkToClipboard(e) {
		const href = e.target.closest('a').href
		navigator.clipboard.writeText(href).then(
			() => {
				console.log(`Successfully copied ${href} to clipboard`)
			},
			() => {
				console.error(`Error copying ${href} to clipboard`)
			}
		)
	}

	return (
		<Tooltip theme="light" label="Clicking will copy link to clipboard">
			<a
				className={classNames(s.root, className)}
				onClick={copyLinkToClipboard}
				{...rest}
			>
				<div className={s.icon}>
					<IconLink16 color="var(--token-color-foreground-faint)" />
				</div>
			</a>
		</Tooltip>
	)
}
