import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import { MdxPre } from 'components/dev-dot-content/mdx-components/mdx-code-blocks'
// https://helios.hashicorp.design/icons/library
import { IconLoading24 } from '@hashicorp/flight-icons/svg-react/loading-24'
import { IconStopCircle24 } from '@hashicorp/flight-icons/svg-react/stop-circle-24'
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
import FeedbackForm from 'components/feedback-form'

const useAI = () => {
	// The backend id of an AI response
	const [completionId, setCompletionId] = useState('')

	// Is the stream being read?
	const [isReading, setIsReading] = useState(false)
	const [streamedText, setStreamedText] = useState('')

	// Use useMutation to make a POST request more ergonomic
	const mutation = useMutation<
		Response,
		Response,
		{ value: string; accessToken: string }
	>({
		onMutate: async () => {
			// clear previous response
			setStreamedText('...')
			setCompletionId('')
		},
		onError: async (error) => {
			// console.log('mutation error', error)
			const response = error as Response
			switch (response.status) {
				case 400:
				case 401:
				case 403:
				case 404:
				case 429:
					break
			}
		},
		mutationFn: async ({ value: task, accessToken: token }: any) => {
			const response = await fetch('/api/chat/route', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ task }),
			})

			// if the response is not ok, throw it to be handled by onError
			if (!response.ok) {
				throw response
			} else {
				// grab the completion id from the headers
				const completionId = response.headers.get('x-completion-id')
				setCompletionId(completionId)

				return response
			}
		},
	})

	const [reader, setReader] =
		useState<ReadableStreamDefaultReader<Uint8Array> | null>(null)

	// when the mutation / POST is successful
	// - assign the reader to state
	useEffect(() => {
		if (!mutation.data) {
			return
		}
		if (mutation.error) {
			return
		}

		if (!mutation.data.body) {
			return
		}

		if (mutation.data.bodyUsed) {
			return
		}
		if (mutation.data.body.locked) {
			return
		}
		// get the reader from the stream
		const reader = mutation.data.body.getReader()
		setReader(reader)
	}, [mutation.data])

	// perform stream reading
	useEffect(() => {
		// if there's no reader, exit
		if (!reader) {
			return
		}

		// Async function to update state if the reader is closed
		reader.closed.then(() => {
			setIsReading(false)
		})

		// Reset streamed text
		setStreamedText('')

		// Read the stream
		;(async () => {
			// decoder converts the Uint8Array to a human-readable string
			const decoder = new TextDecoder()

			let shouldExit = false
			do {
				setIsReading(true)
				const { done, value } = await reader.read()
				// reached end of stream
				if (done) {
					console.log('reached end of stream')
					reader.releaseLock()
					// clear the reader
					setReader(null)
					// set reading state to false
					setIsReading(false)

					shouldExit = true
					break
				}

				// read the value
				if (!done) {
					// convert `Uint8Array` to `string`
					const data = decoder.decode(value)
					// data should be a string like: 'data: {"content":"arbitrary text\n\n"}\n\n'
					if (!data) {
						continue
					}

					// split by double newline to collect individual SSE messages
					// but leave json-serialized double newlines as is.
					// TODO(kevinwang): are there more edge cases?

					const regexp = /(?!")\n\n(?!")/gi
					const messages = data.split(regexp)

					messages?.forEach((message) => {
						// trim the leading `data: ` from the message
						const jsonString = message.replace(/^data:\s/i, '')
						// parse the json
						if (jsonString.length > 0) {
							const content = JSON.parse(jsonString).content
							setStreamedText((prev) => prev + content)
						}
					})
				}
			} while (!shouldExit)
		})()
	}, [reader])

	return {
		reader,
		streamedText,
		completionId,
		isLoading: mutation.isLoading || isReading,
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
			text: string
			id: string
	  }
	| {
			type: 'system'
			text: string
	  }

const UserMessage = ({ text, image }: { image?: string; text: string }) => {
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
	showArrowDown,
	messageId,
}: {
	markdown: string
	showActions: boolean
	showArrowDown: boolean
	messageId: string
}) => {
	const { session } = useAuthentication()
	const accessToken = session?.accessToken
	// Determines green/red button
	const [sentiment, setSentiment] = useState<1 | -1 | 0>(0)

	const handleSentiment = async ({ sentiment }: { sentiment: -1 | 1 }) => {
		const response = await fetch('/api/chat/completion', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				sentiment,
				messageId,
			}),
		})
		return response
	}

	const handleReason = async ({ reason }: { reason: string }) => {
		const response = fetch('/api/chat/completion', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				reason,
				messageId,
			}),
		})
		return response
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(markdown)
	}

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
							aria-label="Copy to clipboard"
							onClick={handleCopy}
						/>

						<Button
							size="small"
							color="secondary"
							className={cn({ [s.sentiment_like]: sentiment == 1 })}
							disabled={sentiment == 1}
							icon={<IconThumbsUp24 height={12} width={12} />}
							aria-label="Like this response"
							onClick={async () => {
								await handleSentiment({ sentiment: 1 })
								setSentiment(1)
							}}
						/>

						<Button
							size="small"
							color="secondary"
							className={cn({ [s.sentiment_dislike]: sentiment == -1 })}
							disabled={sentiment == -1}
							icon={<IconThumbsDown24 height={12} width={12} />}
							aria-label="Dislike this response"
							onClick={async () => {
								await handleSentiment({ sentiment: -1 })
								setSentiment(-1)
							}}
						/>
					</div>

					<div
						className={cn(s.message_feedbackForm, {
							[s.message_feedbackFormVisible]: sentiment != 0,
						})}
					>
						{sentiment != 0 ? (
							<FeedbackForm
								questions={[
									{
										id: 'reason',
										type: 'text',
										label: 'Provide additional feedback to help us improve',
										placeholder:
											sentiment == 1
												? 'What did you like about the response?'
												: 'What was the issue with the response? How could it be improved?',
										optional: true,
										buttonText: 'Submit answer',
									},
								]}
								finishedText={
									<div>
										Thank you! Your feedback will help us improve our websites.
									</div>
								}
								onQuestionSubmit={async (responses) => {
									const value = responses[0].value
									await handleReason({ reason: value })
									return
								}}
							/>
						) : null}
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

// TODO(kevinwang): error styling.
const SystemMessage = ({ text }: { text: string }) => {
	return (
		<div className={cn(s.message, s.message_assistant)}>
			<IconTile className={cn(s.message_icon_error)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={cn(s.message_content)}>{text}</div>
		</div>
	)
}

const ChatBox = () => {
	const { mutation, streamedText, completionId, isLoading, reader } = useAI()
	const { user, session } = useAuthentication()
	const accessToken = session?.accessToken

	// Text area
	const [userInput, setUserInput] = useState('')
	// List of user and assistant messages
	const [messageList, setMessageList] = useState<Message[]>([])

	const handleSubmit = async (e) => {
		const task = e.currentTarget.task?.value
		e.preventDefault()

		// Reset previous messages?
		setMessageList([])

		// Clear textarea
		setUserInput('')

		mutation.mutate({
			value: task,
			accessToken,
		})

		// append user message to list
		setMessageList((prev) => [
			...prev,
			{ type: 'user', text: task, image: user.image },
		])
	}

	// Throttle this value to enable uninterrupted smooth scrolling
	const throttledText = useThrottle(streamedText, 100)

	// scroll text response to bottom as text streams in from the backend
	const textContentRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		textContentRef.current?.scrollTo({
			top: textContentRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [throttledText])

	const [textContentRef2, textContentScrollBarIsVisible] = useScrollBarVisible()

	// update component state when text is streamed in from the backend
	useEffect(() => {
		if (mutation.error) {
			setMessageList((prev) => [
				...prev,
				{ type: 'system', text: mutation.error.statusText },
			])
			return
		}

		if (!streamedText || !completionId) {
			return
		}

		setMessageList((prev) => {
			const next = [...prev]
			const assistantMessage = next.find(
				(e) => e.type == 'assistant' && e.id === completionId
			)

			if (assistantMessage) {
				assistantMessage.text = streamedText
			} else {
				next.push({
					type: 'assistant',
					text: streamedText,
					id: completionId,
				})
			}
			return next
		})
	}, [streamedText, completionId, mutation.error])

	return (
		<div className={cn(s.chat)}>
			<>
				{messageList.length === 0 ? (
					<EmptyState />
				) : (
					<div
						ref={mergeRefs([textContentRef, textContentRef2])}
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
											key={e.id}
											messageId={e.id}
											showActions={shouldShowActions}
											showArrowDown={textContentScrollBarIsVisible}
										/>
									)
								}
								case 'system': {
									return <SystemMessage key={i} text={e.text} />
								}
							}
						})}
					</div>
				)}

				<form id="chat-create" onSubmit={handleSubmit}>
					<div className={s['search-area']}>
						{isLoading ? (
							<IconLoading24 className={'loadingIcon'} />
						) : (
							<IconSend24 />
						)}
						<textarea
							value={userInput}
							onChange={(e) => setUserInput(e.currentTarget.value)}
							id="task"
							rows={1}
							className={cn(s.reset, s.textarea)}
							placeholder="Send a new message"
							disabled={isLoading}
						/>
						{isLoading ? (
							<Button
								type={'button'}
								icon={<IconStopCircle24 height={16} width={16} />}
								text={'Stop generating'}
								color={'critical'}
								onClick={() => {
									reader?.cancel()
									mutation.reset()
								}}
							/>
						) : (
							<Button
								disabled={userInput.length < 1}
								type={'submit'}
								icon={<IconSend24 height={16} width={16} />}
								text={'Send'}
							/>
						)}
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

const EmptyState = () => {
	return (
		<div className={s.emptyArea}>
			<div className={cn(s.col, s.left)}>
				<IconWand24 />
				<div className={s.copy}>
					<h3>Welcome to Developer AI</h3>
					<p>
						Your personal AI-powered assistant, we’re ready to help you get the
						most out of Developer. Let’s get started on this journey together...
					</p>
				</div>
			</div>
			<div className={cn(s.col, s.right)}>
				<div className={s.row}>
					<IconUser16 />
					<div className={s.rowText}>
						<h4 className={s.rowTextHeading}>Personalized recommendations</h4>
						<p className={s.rowTextBody}>Coming soon...</p>
					</div>
				</div>
				<div className={s.row}>
					<IconDiscussionCircle16 />
					<div className={s.rowText}>
						<h4 className={s.rowTextHeading}>Natural language conversations</h4>
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

function useThrottle<T = any>(value: T, limit: number) {
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
