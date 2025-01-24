/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState } from 'react'
import classNames from 'classnames'
import Button from 'components/button'
import { IconClipboardCopy16 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-16'
import { IconCheck16 } from '@hashicorp/flight-icons/svg-react/check-16'
import s from './copy-content-button.module.css'

interface CopyContentButtonProps {
	markdownContent: string
	className?: string
}

const CopyContentButton = ({
	markdownContent,
	className,
}: CopyContentButtonProps) => {
	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(markdownContent)
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy content:', err)
		}
	}

	return (
		<Button
			onClick={handleCopy}
			color="secondary"
			className={classNames(className)}
			aria-label="Copy page content as markdown"
			icon={isCopied ? <IconCheck16 /> : <IconClipboardCopy16 />}
			text={isCopied ? 'Copied!' : 'Markdown'}
		/>
	)
}

export default CopyContentButton
