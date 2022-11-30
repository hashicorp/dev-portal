import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionStatus } from 'types/auth'

export async function fetchSession() {
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

// TODO support the 'required' on unauthenticated thing
// TODO better error handling - repro error

function getStatus(
	data: null | Session,
	status: UseQueryResult<Session>['status']
): SessionStatus {
	switch (status) {
		case 'loading':
			return 'loading'
		case 'success':
			// maybe handle this elsewhere...or decide how to calculate this
			if (data?.accessToken) {
				return 'authenticated'
			}
			break
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
	const query = useQuery<Session>(['session'], fetchSession, { retry: false })

	return { data: query.data, status: getStatus(query.data, query.status) }
}
