/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, {
	Component,
	ErrorInfo,
	ReactNode,
	useCallback,
	useState,
	useRef,
	createContext,
	useContext,
} from 'react'

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode)
	onError?: (error: Error, errorInfo: ErrorInfo) => void
	resetOnPropsChange?: boolean
	resetKeys?: Array<string | number>
}

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
	errorInfo?: ErrorInfo
}

interface ErrorBoundaryContextType {
	resetErrorBoundary: () => void
	captureError: (error: Error) => void
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(
	null
)

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
		this.setState({ errorInfo })

		if (this.props.onError) {
			this.props.onError(error, errorInfo)
		}
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		if (this.props.resetKeys && prevProps.resetKeys) {
			const hasResetKeyChanged = this.props.resetKeys.some(
				(key, index) => key !== prevProps.resetKeys![index]
			)

			if (hasResetKeyChanged && this.state.hasError) {
				this.setState({
					hasError: false,
					error: undefined,
					errorInfo: undefined,
				})
			}
		}
	}

	render(): ReactNode {
		if (this.state.hasError && this.state.error) {
			if (typeof this.props.fallback === 'function') {
				return this.props.fallback(this.state.error, this.state.errorInfo!)
			}

			return (
				this.props.fallback || (
					<div
						style={{
							padding: '16px',
							border: '1px solid #e74c3c',
							borderRadius: '4px',
							backgroundColor: '#fdf2f2',
							color: '#e74c3c',
						}}
					>
						<strong>Something went wrong.</strong>
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details style={{ marginTop: '8px' }}>
								<summary>Error details (development only)</summary>
								<pre style={{ fontSize: '12px', overflow: 'auto' }}>
									{this.state.error.message}
									{this.state.errorInfo && (
										<>
											<br />
											<br />
											Component Stack:
											{this.state.errorInfo.componentStack}
										</>
									)}
								</pre>
							</details>
						)}
					</div>
				)
			)
		}

		return this.props.children
	}
}

export function useErrorBoundary() {
	const [resetKey, setResetKey] = useState(0)
	const errorRef = useRef<Error | null>(null)

	const resetErrorBoundary = useCallback(() => {
		// Increment reset key to trigger error boundary reset
		setResetKey((prev) => prev + 1)
		errorRef.current = null
	}, [])

	const captureError = useCallback((error: Error) => {
		errorRef.current = error
		throw error
	}, [])

	const context = useContext(ErrorBoundaryContext)

	if (context) {
		return context
	}

	return {
		resetErrorBoundary,
		captureError,
		resetKey,
	}
}

interface ErrorBoundaryWrapperProps
	extends Omit<ErrorBoundaryProps, 'children' | 'resetKeys'> {
	children: ReactNode
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
	children,
	...props
}) => {
	const [resetKey, setResetKey] = useState(0)

	const resetErrorBoundary = useCallback(() => {
		setResetKey((prev) => prev + 1)
	}, [])

	const captureError = useCallback((error: Error) => {
		throw error
	}, [])

	const contextValue: ErrorBoundaryContextType = {
		resetErrorBoundary,
		captureError,
	}

	return (
		<ErrorBoundaryContext.Provider value={contextValue}>
			<ErrorBoundary {...props} resetKeys={[resetKey]}>
				{children}
			</ErrorBoundary>
		</ErrorBoundaryContext.Provider>
	)
}

export function useErrorBoundaryContext() {
	const context = useContext(ErrorBoundaryContext)
	if (!context) {
		throw new Error(
			'useErrorBoundaryContext must be used within an ErrorBoundaryWrapper'
		)
	}
	return context
}

export const withErrorBoundary = <T extends object>(
	Component: React.ComponentType<T>,
	fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode),
	onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
	const WrappedComponent = (props: T) => (
		<ErrorBoundary fallback={fallback} onError={onError}>
			<Component {...props} />
		</ErrorBoundary>
	)

	WrappedComponent.displayName = `withErrorBoundary(${
		Component.displayName || Component.name
	})`

	return WrappedComponent
}

export default ErrorBoundaryWrapper

export { ErrorBoundary as ErrorBoundaryClass }
