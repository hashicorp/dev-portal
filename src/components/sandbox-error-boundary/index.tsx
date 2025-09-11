/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'

interface SandboxErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode
	labId?: string
}

const SandboxErrorFallback = ({ 
	error, 
	resetErrorBoundary, 
	labId 
}: { 
	error: Error
	resetErrorBoundary: () => void
	labId?: string
}) => {
	return (
		<div className="sandbox-error-boundary">
			<div className="error-content">
				<h3>Something went wrong with the sandbox</h3>
				<p>
					We encountered an unexpected error while loading your sandbox environment.
					This issue has been reported and we&rsquo;re working to fix it.
				</p>
				<details style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
					<summary>Technical Details</summary>
					<pre style={{ 
						marginTop: '0.5rem', 
						padding: '0.5rem', 
						backgroundColor: '#f5f5f5',
						borderRadius: '4px',
						overflow: 'auto',
						fontSize: '0.75rem'
					}}>
						{error.message}
					</pre>
				</details>
				<div style={{ marginTop: '1rem' }}>
					<button 
						onClick={resetErrorBoundary}
						style={{
							backgroundColor: '#1f2937',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							padding: '0.75rem 1.5rem',
							marginRight: '0.5rem',
							cursor: 'pointer'
						}}
					>
						Try Again
					</button>
					<button 
						onClick={() => window.location.reload()}
						style={{
							backgroundColor: 'transparent',
							color: '#1f2937',
							border: '1px solid #d1d5db',
							borderRadius: '4px',
							padding: '0.75rem 1.5rem',
							cursor: 'pointer'
						}}
					>
						Refresh Page
					</button>
				</div>
			</div>
		</div>
	)
}

const SandboxErrorBoundary = ({ 
	children, 
	fallback, 
	labId 
}: SandboxErrorBoundaryProps) => {
	const handleError = (error: Error, errorInfo: { componentStack: string }) => {
		if (labId) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_ERROR, {
				labId,
				error: error.message,
				page: typeof window !== 'undefined' ? window.location.pathname : '',
			})
		}

		console.error('Sandbox Error Boundary caught an error:', error, errorInfo)
	}

	return (
		<ErrorBoundary
			FallbackComponent={fallback ? () => <>{fallback}</> : (props) => <SandboxErrorFallback {...props} labId={labId} />}
			onError={handleError}
		>
			{children}
		</ErrorBoundary>
	)
}

export default SandboxErrorBoundary
