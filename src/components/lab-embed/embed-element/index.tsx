/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MutableRefObject, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { useInstruqtEmbed } from 'contexts/instruqt-lab'
import s from './embed-element.module.css'

export default function EmbedElement(): JSX.Element {
	const ref: MutableRefObject<HTMLIFrameElement> = useRef()

	useEffect(() => {
		if (!ref.current) {
			return
		}

		// ensures that focus properly shifts when the lab component is mounted
		ref.current.focus()
	}, [])

	const { active, labId } = useInstruqtEmbed()

	return (
		<iframe
			ref={ref}
			title="Instruqt"
			width="100%"
			height="100%"
			sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
			src={`https://play.instruqt.com/embed/${labId}`}
			style={{ height: 'inherit' }}
			className={classNames(s.baseEmbedElement, { [s.hide]: !active })}
		/>
	)
}
