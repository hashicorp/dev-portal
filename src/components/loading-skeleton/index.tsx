import { createContext, ReactElement, ReactNode, useContext } from 'react'
import classNames from 'classnames'
import s from './loading-skeleton.module.css'

type LoadingSkeletonContextState = undefined | { isLoading: boolean }

const LoadingSkeletonContext = createContext<LoadingSkeletonContextState>({
	isLoading: false,
})
LoadingSkeletonContext.displayName = 'LoadingSkeletonContext'

interface LoadingSkeletonProviderProps {
	isLoading?: boolean
	children: ReactNode
}

const LoadingSkeletonProvider = ({
	isLoading = false,
	children,
}: LoadingSkeletonProviderProps) => {
	return (
		<LoadingSkeletonContext.Provider value={{ isLoading }}>
			{children}
		</LoadingSkeletonContext.Provider>
	)
}

const useLoadingSkeletonState = (): LoadingSkeletonContextState => {
	return useContext(LoadingSkeletonContext)
}

interface LoadingSkeletonProps {
	children: ReactNode
	className?: string
}

const LoadingSkeleton = ({ children, className }: LoadingSkeletonProps) => {
	const { isLoading } = useLoadingSkeletonState()

	if (isLoading) {
		return <div className={classNames(s.root, className)} />
	}

	return <>{children}</>
}

type WithOptionalProps<Props> = Props & { className?: string }

function withLoadingSkeleton<ComponentProps>(
	className: string,
	Component: (props: ComponentProps) => ReactElement
): (componentProps?: WithOptionalProps<ComponentProps>) => ReactElement {
	// eslint-disable-next-line react/display-name
	return (componentProps?: WithOptionalProps<ComponentProps>) => {
		return (
			<LoadingSkeleton
				className={classNames(componentProps?.className, className)}
			>
				<Component {...componentProps} />
			</LoadingSkeleton>
		)
	}
}

export {
	LoadingSkeleton,
	LoadingSkeletonProvider,
	useLoadingSkeletonState,
	withLoadingSkeleton,
}
