import { z } from 'zod'
import validateJWT from './validate-jwt'

const userInfoSchema = z.object({
	aud: z.array(z.string()),
	auth_time: z.number(),
	email: z.string(),
	email_verified: z.boolean(),
	iat: z.number(),
	iss: z.string(),
	name: z.string(),
	nickname: z.string(),
	picture: z.string(),
	rat: z.number(),
	sub: z.string(),
	updated_at: z.string(),
})

export type UserInfoSchema = z.infer<typeof userInfoSchema>

export const fetchUserInfo = async (jwt: string): Promise<UserInfoSchema> => {
	const { iss } = await validateJWT(jwt)
	const res = await fetch(new URL('userinfo', iss).toString(), {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	})
	const userInfo = await res.json()
	return userInfo
}
