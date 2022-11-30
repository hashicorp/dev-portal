import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionStatus } from 'types/auth'
import { UseAuthenticationOptions } from 'hooks/use-authentication/types'

type QuerySession = Session | null

async function fetchSession(): Promise<QuerySession> {
	const res = await fetch('/api/auth/session')
	console.log('FETCHING SESSION')
	if (res.ok) {
		const session = await res.json()
		console.log({ session })
		if (session?.error) {
			console.error(session.error)
			throw new Error(session.error)
		}

		if (Object.keys(session).length) {
			return session
		}
		return null
	} else {
		throw new Error('[use-session] Unable to fetch session data')
	}
}

function getStatus(
	data: QuerySession,
	status: UseQueryResult<QuerySession>['status']
): SessionStatus {
	switch (status) {
		case 'loading':
			return 'loading'
		case 'success':
			// maybe handle this elsewhere...or decide how to calculate this
			if (data?.accessToken) {
				return 'authenticated'
			} else {
				return 'unauthenticated'
			}
		case 'error':
			return 'unauthenticated'
		default:
			return 'unauthenticated'
	}
}

export function useSession({
	required = false,
	onUnauthenticated = null,
}: UseAuthenticationOptions): {
	data: UseQueryResult<QuerySession>['data']
	status: 'unauthenticated' | 'authenticated' | 'loading'
} {
	const query = useQuery<QuerySession>(['session'], fetchSession, {
		retry: false,
		onSettled: (
			data: QuerySession,
			error: UseQueryResult<QuerySession>['error']
		) => {
			console.log('SETTLED', data)
			const shouldPromptSignIn = required && !error && !data?.accessToken
			if (shouldPromptSignIn) {
				const url = `/api/auth/signin?${new URLSearchParams({
					error: 'SessionRequired',
					callbackUrl: window.location.href,
				})}`
				if (onUnauthenticated) {
					onUnauthenticated()
				} else {
					window.location.href = url
				}
			}
		},
	})

	return { data: query.data, status: getStatus(query.data, query.status) }
}
