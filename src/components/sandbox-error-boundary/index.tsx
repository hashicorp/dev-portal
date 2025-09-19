/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import s from './sandbox-error-boundary.module.css'

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
				<details className={s.details}>
					<summary>Technical Details</summary>
					<pre className={s.detailsContent}>
						{error.message}
					</pre>
				</details>
				<div className={s.buttonContainer}>
					<button 
						onClick={resetErrorBoundary}
						className={s.primaryButton}
					>
						Try Again
					</button>
					<button 
						onClick={() => window.location.reload()}
						className={s.secondaryButton}
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
