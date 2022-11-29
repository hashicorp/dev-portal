import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionStatus } from 'types/auth'

export async function fetchSession() {
	const res = await fetch('/api/auth/session')
	if (res.ok) {
		const session = await res.json()
		if (Object.keys(session).length) {
			return session
		}
		return null
	} else {
		// throw error
		return res
	}
}

//redirectTo = '/api/auth/signin?error=SessionExpired',

// TODO support the 'required' on unauthentcaited thing
// TODO error handling

function getStatus(status: UseQueryResult<Session>['status']): SessionStatus {
	switch (status) {
		case 'loading':
			return 'loading'
		case 'success':
			return 'authenticated'
		case 'error':
			return 'unauthenticated'
		default:
			return 'unauthenticated'
	}
}

export function useSession(): {
	data: UseQueryResult<Session>['data']
	status: 'unauthenticated' | 'authenticated' | 'loading'
} {
	const query = useQuery<Session>(['session'], fetchSession)
	console.log(query, query.status, 'in QUERY!!!!!!!')

	return { data: query.data, status: getStatus(query.status) }
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
