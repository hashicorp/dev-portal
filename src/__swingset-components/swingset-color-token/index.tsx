/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

function SwingsetColorToken({ token }: { token: string }): React.ReactElement {
	return (
		<div
			style={{
				width: '100%',
				background: `var(--${token})`,
				height: '50px',
				boxShadow: 'inset 0px 0px 1px rgba(0,0,0,0.5)',
				position: 'relative',
			}}
		>
			<code
				style={{
					position: 'absolute',
					top: '5px',
					right: '5px',
					background: 'rgba(240, 240, 240, 0.85)',
					padding: '0.25rem 0.5rem',
					fontSize: '0.75rem',
				}}
			>
				var(--{`${token}`})
			</code>
		</div>
	)
}

export default SwingsetColorToken
