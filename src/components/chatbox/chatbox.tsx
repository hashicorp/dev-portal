import React, {
	useEffect,
	useState,
	useRef,
	type PropsWithChildren,
} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import { MdxPre } from 'components/dev-dot-content/mdx-components/mdx-code-blocks'
// https://helios.hashicorp.design/icons/library
import { IconLoading24 } from '@hashicorp/flight-icons/svg-react/loading-24'
import { IconSend24 } from '@hashicorp/flight-icons/svg-react/send-24'
import { IconThumbsUp24 } from '@hashicorp/flight-icons/svg-react/thumbs-up-24'
import { IconThumbsDown24 } from '@hashicorp/flight-icons/svg-react/thumbs-down-24'
import { IconClipboard24 } from '@hashicorp/flight-icons/svg-react/clipboard-24'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'
import { IconArrowDownCircle16 } from '@hashicorp/flight-icons/svg-react/arrow-down-circle-16'
import { IconDiscussionCircle16 } from '@hashicorp/flight-icons/svg-react/discussion-circle-16'
import { IconUser16 } from '@hashicorp/flight-icons/svg-react/user-16'
import { IconBulb16 } from '@hashicorp/flight-icons/svg-react/bulb-16'

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
			// console.log('mutation started', variables)
			// clear previous response
			setStreamedText('...')
			setIsLoading(true)
		},
		onError: async (error, variables, context) => {
			// console.log('mutation error', error)
			const response = error as Response
			setIsLoading(false)
			switch (response.status) {
				case 400: {
					// @ts-expect-error - error is unknown
					const jsonError = await mutation.error.json()
					setStreamedText(
						'```json\n' + JSON.stringify(jsonError, null, 2) + '\n```'
					)
					break
				}
				case 401:
				case 403:
				case 404:
				case 429: {
					const statusText = response.statusText
					setStreamedText(statusText)
					break
				}
				default:
					setStreamedText(
						'Something went wrong, and we’re not quite sure how to fix it...'
					)
					break
			}
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

			// if the response is not ok, throw it. It's likely JSON
			if (!response.ok) {
				throw response
			}
			// if the response is ok, it'll be a readable stream
			return response
		},
	})

	// when the mutation is successful, read the stream
	useEffect(() => {
		async function doThing() {
			if (!mutation.data?.body) {
				return
			}
			if (mutation.data.bodyUsed) {
				return
			}
			if (mutation.data.status == 400) {
				const jsonError = await mutation.data.json()
				setStreamedText(
					'```json\n' + JSON.stringify(jsonError, null, 2) + '\n```'
				)
				return
			}
			if (mutation.data.body.locked) {
				return
			}
			// reset streamed text
			setStreamedText('')

			// get the reader from the stream
			const reader = mutation.data.body.getReader()

			// decoder converts the Uint8Array to a human-readable string
			const decoder = new TextDecoder()

			// lift out an async function for easy calling within useEffect
			const processStream = async (
				rd: ReadableStreamDefaultReader<Uint8Array>,
				{
					onData,
				}: {
					onData: (data: string) => void
				}
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
					// value is Uint8Array
					const data = decoder.decode(value)
					// data is a chunk of server-sent events
					onData(data)
				} while (!shouldExit)
			}

			processStream(reader, {
				onData: (data) => {
					if (!data) {
						return
					}

					// split by double newline to collect individual messages
					const messages = data.split('\n\n')
					// "data: {\ndata: \"content\": \"Sure\"\ndata: }"

					if (!messages) {
						return
					}

					messages.forEach((message) => {
						const lines = message
							.split('\n') // collect individual lines of server-sent JSON
							.filter(Boolean) // filter the last empty string

						const jsonString = lines.reduce((acc, e) => {
							acc += e.replace(/^data:\s/i, '')
							return acc
						}, '')
						if (jsonString.length > 0) {
							const jsonData = JSON.parse(jsonString)
							const text = jsonData.content

							console.log(text)
							setStreamedText((prev) => prev + text)
						}
					})
				},
			})
		}
		doThing()
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
	text,
	image,
}: PropsWithChildren<{ image?: string; text: string }>) => {
	return (
		<div className={cn(s.message, s.message_user)}>
			<div className={cn(s.message_avatar)}>
				{image ? <img src={image} alt="user avatar" /> : null}
			</div>
			<div>{text}</div>
		</div>
	)
}

const AssistantMessage = ({
	markdown,
	showActions,
	onCopy,
	onLike,
	onDislike,
	showArrowDown,
}: PropsWithChildren<{
	markdown: string
	showActions: boolean
	onCopy: () => void
	onLike: () => void
	onDislike: () => void
	showArrowDown: boolean
}>) => {
	return (
		<div className={cn(s.message, s.message_assistant)}>
			<IconTile className={cn(s.message_icon)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={cn(s.message_content)}>
				<ReactMarkdown
					components={{
						// @ts-expect-error - TODO(kevinwang)  fix this type
						pre: MdxPre,
					}}
					className={s.message_markdown}
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
				>
					{markdown}
				</ReactMarkdown>
				<div
					className={cn(s.message_AssistantMessageFooter, {
						[s.message_AssistantMessageFooterHidden]: !showActions,
					})}
				>
					<span className={s.message_divider} />
					<div className={s.message_actionButtons}>
						<Button
							size="small"
							color="secondary"
							icon={<IconClipboard24 height={12} width={12} />}
							aria-label="FIXME"
							onClick={onCopy}
						></Button>
						<Button
							size="small"
							color="secondary"
							icon={<IconThumbsUp24 height={12} width={12} />}
							aria-label="FIXME"
							onClick={onLike}
						></Button>
						<Button
							size="small"
							color="secondary"
							icon={<IconThumbsDown24 height={12} width={12} />}
							aria-label="FIXME"
							onClick={onDislike}
						></Button>
					</div>
				</div>
			</div>
			<div className={cn(s.message_gutter)}>
				{showArrowDown ? (
					<IconTile size="small">
						<IconArrowDownCircle16 />
					</IconTile>
				) : null}
			</div>
		</div>
	)
}

const ChatBox = () => {
	const { mutation, streamedText, isLoading } = useAI()
	const { user, session } = useAuthentication()
	const accessToken = session?.accessToken

	const handleSubmit = async (e) => {
		const task = e.currentTarget.task?.value

		e.preventDefault()
		// clear previous state
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
		// {
		// 	type: 'user',
		// 	text: 'What is boundary?',
		// 	image: 'https://avatars.githubusercontent.com/u/26389321?v=4',
		// },
		// {
		// 	type: 'assistant',
		// 	text: 'Boundary is an identity-aware proxy that simplifies and secures least-privileged access to cloud infrastructure. It enables single sign-on to target services and applications via external identity providers, provides just-in-time network access to private resources, enables passwordless access with dynamic credentials via HashiCorp Vault, automates discovery of new target systems, records and manages privileged sessions, and standardizes access workflow with a consistent experience for any type of infrastructure across any provider. For more information, please refer to What is Boundary and Why Boundary.'.repeat(
		// 		1
		// 	),
		// 	image: undefined,
		// },
	])

	const throttledText = useThrottle(streamedText, 100)

	// side-effect to scroll text response to bottom as text streams in from the backend
	const textContentRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		// scroll to bottom
		textContentRef.current?.scrollTo({
			top: textContentRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [throttledText])
	const [textContentRef2, textContentScrollBarIsVisible] = useScrollBarVisible()

	// update component state when text is streamed in from the backend
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
			<>
				{messageList.length === 0 ? (
					<div className={s.emptyArea}>
						<div className={cn(s.col, s.left)}>
							<IconWand24
								style={{
									color: 'var(--foreground-highlight-on-surface, #911ced)',
								}}
							/>
							<div className={s.copy}>
								<h3>Welcome to Developer AI</h3>
								<p>
									Your personal AI-powered assistant, we’re ready to help you
									get the most out of Developer. Let’s get started on this
									journey together...
								</p>
							</div>
						</div>
						<div className={cn(s.col, s.right)}>
							<div className={s.row}>
								<IconUser16 />
								<div className={s.rowText}>
									<h4 className={s.rowTextHeading}>
										Personalized recommendations
									</h4>
									<p className={s.rowTextBody}>Coming soon...</p>
								</div>
							</div>
							<div className={s.row}>
								<IconDiscussionCircle16 />
								<div className={s.rowText}>
									<h4 className={s.rowTextHeading}>
										Natural language conversations
									</h4>
									<p className={s.rowTextBody}>Coming soon...</p>
								</div>
							</div>
							<div className={s.row}>
								<IconBulb16 />
								<div className={s.rowText}>
									<h4 className={s.rowTextHeading}>Knowledge base</h4>
									<p className={s.rowTextBody}>Yes</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div
						ref={mergeRefs([textContentRef, textContentRef2])}
						// ref={textContentRef}
						className={s.chatbody}
					>
						{messageList.map((e, i) => {
							switch (e.type) {
								case 'user': {
									return <UserMessage key={i} image={e.image} text={e.text} />
								}
								case 'assistant': {
									const shouldShowActions = e.text?.length > 20 && !isLoading
									return (
										<AssistantMessage
											markdown={e.text}
											key={i}
											showActions={shouldShowActions}
											onCopy={() => alert('TODO: copy')}
											onLike={() => alert('TODO: like')}
											onDislike={() => alert('TODO: dislike')}
											showArrowDown={textContentScrollBarIsVisible}
										/>
									)
								}
								default:
									null
							}
						})}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className={s['search-area']}>
						{isLoading ? (
							<IconLoading24 className={'loadingIcon'} />
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
							icon={<IconSend24 height={16} width={16} />}
							text="Send"
						/>
					</div>

					<footer className={s.bottom}>
						<span className={s.disclaimer}>
							AI Disclaimer: HashiCorp AI may produce inaccurate information and
							cause your computer to implode. Use at your own risk.
						</span>
					</footer>
				</form>
			</>
		</div>
	)
}

export default ChatBox

function useScrollBarVisible() {
	const elementRef = useRef(null)
	const [isScrollbarVisible, setIsScrollbarVisible] = useState(false)

	useEffect(() => {
		const element = elementRef.current
		if (!element) {
			return
		}

		function checkScrollbarVisibility() {
			setIsScrollbarVisible(
				element.scrollHeight > element.clientHeight ||
					element.scrollWidth > element.clientWidth
			)
		}

		element.addEventListener('scroll', checkScrollbarVisibility)
		window.addEventListener('resize', checkScrollbarVisibility)

		checkScrollbarVisibility()

		return () => {
			window.removeEventListener('resize', checkScrollbarVisibility)
			element.removeEventListener('scroll', checkScrollbarVisibility)
		}
	}, [])

	return [elementRef, isScrollbarVisible] as const
}

// https://github.com/gregberge/react-merge-refs/blob/main/src/index.tsx
export function mergeRefs<T = any>(
	refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value)
			} else if (ref != null) {
				;(ref as React.MutableRefObject<T | null>).current = value
			}
		})
	}
}

function useThrottle<T extends any>(value: T, limit: number) {
	const [throttledValue, setThrottledValue] = useState(value)
	const lastRan = useRef(Date.now())

	useEffect(() => {
		const handler = setTimeout(function () {
			if (Date.now() - lastRan.current >= limit) {
				setThrottledValue(value)
				lastRan.current = Date.now()
			}
		}, limit - (Date.now() - lastRan.current))

		return () => {
			clearTimeout(handler)
		}
	}, [value, limit])

	return throttledValue
}
