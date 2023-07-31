import React, {
	useEffect,
	useState,
	useRef,
	type PropsWithChildren,
} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// https://helios.hashicorp.design/icons/library
import { IconLoading24 } from '@hashicorp/flight-icons/svg-react/loading-24'
import { IconSend24 } from '@hashicorp/flight-icons/svg-react/send-24'
import { IconLock24 } from '@hashicorp/flight-icons/svg-react/lock-24'
import { IconHashicorp24 } from '@hashicorp/flight-icons/svg-react/hashicorp-24'
import { IconThumbsUp24 } from '@hashicorp/flight-icons/svg-react/thumbs-up-24'
import { IconThumbsDown24 } from '@hashicorp/flight-icons/svg-react/thumbs-down-24'
import { IconClipboard24 } from '@hashicorp/flight-icons/svg-react/clipboard-24'

import { useMutation } from '@tanstack/react-query'

import useAuthentication from 'hooks/use-authentication'
import IconTile from 'components/icon-tile'
import Button from 'components/button'

import cn from 'classnames'
import s from './chatbox.module.css'

const useAI = () => {
	const [streamedText, setStreamedText] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	// leverage useMutation to make a POST request more ergonomic
	// this returns a `ReadableStream<Uint8Array>`
	const mutation = useMutation({
		onMutate: async (variables: any) => {
			// clear previous response
			setStreamedText('...')
			setIsLoading(true)
		},
		mutationFn: async ({ value: task, accessToken: token }) => {
			const response = await fetch('/api/chat/route', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					task: task,
				}),
			})
			// read incoming stream (ReadableStream<Uint8Array>)
			return response.body
		},
	})

	// when the mutation is successful, read the stream
	useEffect(() => {
		if (!mutation.data) {
			return
		}
		if (mutation.data.locked) {
			return
		}
		// reset streamed text
		setStreamedText('')

		// get the reader from the stream
		const reader = mutation.data.getReader()

		// decoder converts the Uint8Array to a human-readable string
		const decoder = new TextDecoder()

		// lift out an async function for easy calling within useEffect
		const processStream = async (
			rd: ReadableStreamDefaultReader<Uint8Array>
		) => {
			let shouldExit = false

			do {
				const { done, value } = await rd.read()
				// reached end of stream
				if (done) {
					rd.releaseLock()
					setIsLoading(false)
					shouldExit = true
					break
				}
				setStreamedText((prev) => prev + decoder.decode(value))
			} while (!shouldExit)
		}

		processStream(reader)
	}, [mutation.data])

	return {
		streamedText,
		isLoading,
		mutation,
	}
}

type Message =
	| {
			type: 'user'
			image?: string
			text: string
	  }
	| {
			type: 'assistant'
			image?: undefined
			text: string
	  }

const UserMessage = ({
	children,
	image,
}: PropsWithChildren<{ image?: string }>) => {
	return (
		<div className={cn(s.message, s.userMessage)}>
			<div className={cn(s.avatar, s.userAvatar)}>
				{image ? <img src={image} alt="user avatar" /> : null}
			</div>
			<div>{children}</div>
		</div>
	)
}

const AssistantMessage = ({ children }: PropsWithChildren) => {
	return (
		<div className={cn(s.message, s.assistantMessage)}>
			<IconTile className={cn(s.icon)}>
				<IconHashicorp24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div>{children}</div>
		</div>
	)
}

const ChatBox = () => {
	const { mutation, streamedText, isLoading } = useAI()
	const { user, signIn, signUp, session } = useAuthentication()
	const accessToken = session?.accessToken

	const handleSubmit = async (e) => {
		const task = e.currentTarget.task?.value

		e.preventDefault()
		// clear
		setMessageList([])

		mutation.mutate({
			value: task,
			accessToken,
		})
		setMessageList((prev) => [
			...prev,
			{ type: 'user', text: task, image: user.image },
		])
	}

	const [messageList, setMessageList] = useState<Message[]>([
		{
			type: 'user',
			text: 'What is boundary?',
			image: 'https://avatars.githubusercontent.com/u/26389321?v=4',
		},
		{
			type: 'assistant',
			text: 'Boundary is an identity-aware proxy that simplifies and secures least-privileged access to cloud infrastructure. It enables single sign-on to target services and applications via external identity providers, provides just-in-time network access to private resources, enables passwordless access with dynamic credentials via HashiCorp Vault, automates discovery of new target systems, records and manages privileged sessions, and standardizes access workflow with a consistent experience for any type of infrastructure across any provider. For more information, please refer to What is Boundary and Why Boundary.',
			image: undefined,
		},
	])

	// side-effect to scroll text response to bottom as text streams in from the backend
	const textContentRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		// scroll to bottom
		textContentRef.current?.scrollTo({
			top: textContentRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [streamedText])

	useEffect(() => {
		if (!streamedText) {
			return
		}
		setMessageList((prev) => {
			const next = [...prev]
			const assistantMessage = next.find((e) => e.type === 'assistant')
			if (assistantMessage) {
				assistantMessage.text = streamedText
			} else {
				next.push({
					type: 'assistant',
					text: streamedText,
				})
			}
			return next
		})
	}, [streamedText])

	return (
		<div className={cn(s.chat)}>
			{!user ? (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
					}}
				>
					<div
						style={{
							borderRadius: 8,
							border: '1px solid var(--token-color-palette-neutral-400)',
							padding: 14,
							display: 'flex',
						}}
					>
						<IconLock24
							style={{
								color: 'var(--token-color-palette-neutral-400)',
							}}
						/>
					</div>
					<div style={{ textAlign: 'center' }}>
						<p>
							<b>Please login</b>
						</p>
						<p
							style={{
								color: 'var(--token-color-palette-neutral-400)',
							}}
						>
							You must be signed in to use this feature. Please{' '}
							<a
								style={{ cursor: 'pointer' }}
								onClick={(e) => {
									e.preventDefault()
									signIn()
								}}
							>
								sign in
							</a>{' '}
							or{' '}
							<a
								style={{ cursor: 'pointer' }}
								onClick={(e) => {
									e.preventDefault()
									signUp()
								}}
							>
								sign up
							</a>{' '}
							to continue
						</p>
					</div>
				</div>
			) : (
				<>
					<div ref={textContentRef}>
						<div className={s.overlayContainer} style={{ height: 'unset' }}>
							<div className={cn(s.overlay, s.overlaybottom, s.overlaytop)} />

							<div className={s.scroller}>
								{messageList.map((e, i) => {
									switch (e.type) {
										case 'user':
											return (
												<UserMessage key={i} image={e.image}>
													{e.text}
												</UserMessage>
											)
										case 'assistant':
											return (
												<>
													<AssistantMessage key={i}>
														<ReactMarkdown
															remarkPlugins={[remarkGfm]}
															components={{
																p: ({ children }) => (
																	<p style={{ margin: 0 }}>{children}</p>
																),
															}}
														>
															{e.text}
														</ReactMarkdown>
													</AssistantMessage>
													<div
														style={{
															padding: `24px 1.5rem`,
														}}
													>
														<span
															// divider
															style={{
																display: 'block',
																width: `100%`,
																borderBottom: `1px solid var(--token-color-palette-neutral-300)`,
																marginBottom: `24px`,
															}}
														/>
														<div
															style={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'flex-end',
																gap: `16px`,
															}}
														>
															<Button
																size="small"
																color="secondary"
																icon={
																	<IconClipboard24 height={12} width={12} />
																}
																aria-label="FIXME"
															></Button>
															<Button
																size="small"
																color="secondary"
																icon={<IconThumbsUp24 height={12} width={12} />}
																aria-label="FIXME"
															></Button>
															<Button
																size="small"
																color="secondary"
																icon={
																	<IconThumbsDown24 height={12} width={12} />
																}
																aria-label="FIXME"
															></Button>
														</div>
													</div>
												</>
											)
										default:
											null
									}
								})}
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit}>
						<div className={s['search-area']}>
							{isLoading ? (
								<IconLoading24 className={s.loadingIcon} />
							) : (
								<IconSend24 />
							)}
							<textarea
								id="task"
								rows={1}
								className={cn(s.reset, s.textarea)}
								placeholder="Send a new message"
							></textarea>
							<Button
								disabled={isLoading}
								type="submit"
								className={{}}
								icon={<IconSend24 height={16} width={16} />}
								text="Send"
							/>
						</div>

						<footer className={s.bottom}>
							<span className={s.disclaimer}>
								Disclaimer: This is an experimental feature... add more
								warnings.
							</span>
						</footer>
					</form>
				</>
			)}
		</div>
	)
}

export default ChatBox
