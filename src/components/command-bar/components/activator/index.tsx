/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { ReactElement } from 'react'
import classNames from 'classnames'
import { Badge } from '@hashicorp/mds-react/components'
import { useCommandBar } from 'components/command-bar'
import Text from 'components/text'
import s from './command-bar-activator.module.css'

interface CommandBarActivatorProps {
	leadingIcon: ReactElement
	visualLabel: string
}

const CommandBarActivator = ({
	leadingIcon,
	visualLabel,
}: CommandBarActivatorProps) => {
	const { toggleIsOpen } = useCommandBar()
	const iaPosthogVariant = true // TODO: Replace with actual PostHog experiment variant check when available

	return (
		<button
			aria-label={visualLabel}
			className={classNames(s.root, { [s.wideWidth]: iaPosthogVariant })}
			onClick={() => toggleIsOpen()}
		>
			<span className={s.left}>
				<span className={s.leadingIcon}>{leadingIcon}</span>
				<Text asElement="span" className={s.text} size={200} weight="regular">
					{visualLabel}
				</Text>
			</span>
			<span className={s.right}>
				<Badge
					accessibleText="Command or control key"
					color="neutral"
					type="inverted"
					text="⌘/ctrl"
					size="small"
				/>
				<Badge
					accessibleText="K key"
					color="neutral"
					type="inverted"
					text="K"
					size="small"
				/>
			</span>
		</button>
	)
}

export { CommandBarActivator }
