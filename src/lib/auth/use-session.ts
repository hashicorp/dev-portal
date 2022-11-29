import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { useRouter } from 'next/router'
import { SessionStatus } from 'types/auth'

export async function fetchSession() {
	const res = await fetch('/api/auth/session')
	const session = await res.json()
	console.log({ session })
	if (Object.keys(session).length) {
		return session
	}
	return null
}

//redirectTo = '/api/auth/signin?error=SessionExpired',

export function useSession(
	options: {
		required?: boolean
		onUnauthenticated?: any
		queryConfig?: UseQueryOptions
	} = {}
) {
	const { required, onUnauthenticated, queryConfig } = options
	const router = useRouter()
	const query = useQuery(['session'], fetchSession, {
		...queryConfig,
		onSettled(data: Session, error) {
			console.log(data, 'on all settled')
			return data
			// const requiredAndNotLoading =
			// 	required && data.status === 'unauthenticated'
			// if (queryConfig.onSettled) {
			// 	queryConfig.onSettled(data, error)
			// }
			// if (requiredAndNotLoading) {
			// 	const url = `/api/auth/signin?${new URLSearchParams({
			// 		error: 'SessionRequired',
			// 		callbackUrl: window.location.href,
			// 	})}`
			// 	if (onUnauthenticated) {
			// 		onUnauthenticated()
			// 	} else {
			// 		window.location.href = url
			// 	}
			// }
		},
	})
	console.log(query.data, query.status, 'in QUERY!!!!!!!')

	return [query.data, query.status === 'loading']
}

// export function useSession<R extends boolean>(options?: UseSessionOptions<R>) {
// 	if (!SessionContext) {
// 		throw new Error('React Context is unavailable in Server Components')
// 	}

// 	// @ts-expect-error Satisfy TS if branch on line below
// 	const value: SessionContextValue<R> = React.useContext(SessionContext)
// 	if (!value && process.env.NODE_ENV !== 'production') {
// 		throw new Error(
// 			'[next-auth]: `useSession` must be wrapped in a <SessionProvider />'
// 		)
// 	}

// 	const { required, onUnauthenticated } = options ?? {}

// 	const requiredAndNotLoading = required && value.status === 'unauthenticated'

// 	React.useEffect(() => {
// 		if (requiredAndNotLoading) {
// 			const url = `/api/auth/signin?${new URLSearchParams({
// 				error: 'SessionRequired',
// 				callbackUrl: window.location.href,
// 			})}`
// 			if (onUnauthenticated) {
// 				onUnauthenticated()
// 			} else {
// 				window.location.href = url
// 			}
// 		}
// 	}, [requiredAndNotLoading, onUnauthenticated])

// 	if (requiredAndNotLoading) {
// 		return { data: value.data, status: 'loading' } as const
// 	}

// 	return value
// }
