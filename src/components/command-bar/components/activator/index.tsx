/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */
import { ReactElement } from 'react'
import { Badge } from '@hashicorp/mds-react/components'
import { useCommandBar } from 'components/command-bar'
import Text from 'components/text'
import s from './command-bar-activator.module.css'
import { isIOS, isMacOs } from 'react-device-detect'
import dynamic from 'next/dynamic'

interface CommandBarActivatorProps {
	leadingIcon: ReactElement
	visualLabel: string
}

const CommandBarActivator = ({
	leadingIcon,
	visualLabel,
}: CommandBarActivatorProps) => {
	const { toggleIsOpen } = useCommandBar()
	const isCommandButton = isMacOs || isIOS
	return (
		<button
			aria-label={visualLabel}
			className={s.root}
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
					accessibleText={isCommandButton ? "Command key" : "Control key"}
					color="neutral"
					type="inverted"
					text={isCommandButton ? '⌘' : 'ctrl'}
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

export default dynamic(() => Promise.resolve(CommandBarActivator), { ssr: false })