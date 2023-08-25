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
// ms is a transient dep
import ms from 'ms'
import { z } from 'zod'

import { useMutation } from '@tanstack/react-query'

import useAuthentication from 'hooks/use-authentication'
import IconTile from 'components/icon-tile'
import Button from 'components/button'

import cn from 'classnames'
import s from './chatbox.module.css'
import FeedbackForm from 'components/feedback-form'
import {
	streamToAsyncIterable,
	mergeRefs,
	useScrollBarVisible,
	useThrottle,
} from './utils'

const useAI = () => {
	// The backend id of a conversation
	const [conversationId, setConversationId] = useState('')
	// The backend id of the most recently returned message
	const [messageId, setMessageId] = useState('')

	// Is the stream being read?
	const [isReading, setIsReading] = useState(false)
	// The streamed-in text
	const [streamedText, setStreamedText] = useState('')
	// Error text
	const [errorText, setErrorText] = useState('')

	type MutationParams = {
		value: string
		accessToken: string
		conversationId?: string
		parentMessageId?: string
	}

	// Use useMutation to make a POST request more ergonomic
	const mutation = useMutation<Response, Response, MutationParams>({
		onMutate: async () => {
			// clear previous response
			setStreamedText('...')
			setErrorText('')
			setMessageId('')
		},
		onError: async (error) => {
			console.log('onError', error)
			switch (error.status) {
				case 400:
				case 401:
				case 403: {
					setErrorText(`${error.status} ${error.statusText}`)
					break
				}
				case 429: {
					const resetAtSec = mutation.error.headers.get('x-ratelimit-reset')
					const resetAtMs = Number(resetAtSec) * 1000
					const diffMs = resetAtMs - Date.now()

					const errorMessage = `Too many requests. Please try again in ${ms(
						diffMs,
						{
							long: true,
						}
					)}.`
					setErrorText(errorMessage)
					break
				}
				default: {
					setErrorText(`${error.status} ${error.statusText}`)
					break
				}
			}
		},
		mutationFn: async ({
			value: task,
			accessToken: token,
			conversationId,
			parentMessageId,
		}) => {
			// call our edge function which is capable of streaming
			const response = await fetch('/api/chat/route', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ task, conversationId, parentMessageId }),
			})

			// if the response is not ok, throw it to be handled by onError
			if (!response.ok) {
				throw response
			} else {
				// messageId and conversationId are noops until we are ready for multi-message conversations
				setConversationId(response.headers.get('x-conversation-id'))
				setMessageId(response.headers.get('x-message-id'))
				return response
			}
		},
	})

	// A stream reader
	const [reader, setReader] =
		useState<ReadableStreamDefaultReader<Uint8Array> | null>(null)
	// Function to stop the stream
	const stopStream = () => {
		reader?.cancel()
		mutation.reset()
	}

	// when the mutation / POST is successful
	useEffect(() => {
		if (mutation.data?.ok) {
			const stream = mutation.data.body
			const _reader = stream.getReader()
			setReader(_reader)

			// transform stream to async iterable;
			// each chunk is transformed into a SSE object
			const iter = streamToAsyncIterable(_reader)

			// Self-invoking async function to read the stream
			;(async () => {
				// Reset streamed text
				setStreamedText('')
				setIsReading(true)

				// This is our contract with the backend
				const messageFormat = z.object({
					content: z.string(),
				})
				const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
				for await (const { event, data, raw } of iter) {
					const parseResult = messageFormat.safeParse(JSON.parse(data))
					if (!parseResult.success) {
						// malformatted message
						continue
					} else {
						const { content } = parseResult.data

						// - wait an arbitrary amount to opt out of React's automatic batching
						// - This makes the UI appear to streaming in small chunks of text
						//   rather than a large chunk of text all at once
						// - Use a random number to make it feel more natural
						const floor = 20
						const ceil = 70
						await sleep(Math.max(floor, Math.random() * ceil))
						setStreamedText((prev) => prev + content)
					}
				}

				// cleanup
				setIsReading(false)
			})()
		}
	}, [mutation.data])

	return {
		stopStream,
		streamedText,
		errorText,
		conversationId,
		messageId,
		isLoading: mutation.isLoading || isReading,
		sendMessage: mutation.mutate,
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
			messageId: string
			conversationId: string
	  }
	| {
			type: 'application'
			text: string
	  }

const UserMessage = ({ text, image }: { image?: string; text: string }) => {
	return (
		<div className={cn(s.message, s.message_user)}>
			<div className={cn(s.message_avatar)}>
				{image ? <img src={image} alt="user avatar" /> : null}
			</div>
			<div className={cn(s.message_content, s.message_user_input)}>{text}</div>
			<div className={cn(s.message_gutter)}></div>
		</div>
	)
}

const AssistantMessage = ({
	markdown,
	showActions,
	conversationId,
	messageId,
}: {
	markdown: string
	showActions: boolean
	conversationId: string
	messageId: string
}) => {
	const { session } = useAuthentication()
	const accessToken = session?.accessToken
	// Determines green/red button
	const [rating, setRating] = useState<1 | -1 | 0>(0)

	const handleFeedback = async ({
		rating,
		text,
	}: {
		rating?: -1 | 1
		text?: string
	}) => {
		const response = await fetch('/api/chat/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				messageId,
				conversationId,
				rating,
				text,
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
							className={cn({ [s.rating_like]: rating == 1 })}
							disabled={rating == 1}
							icon={<IconThumbsUp24 height={12} width={12} />}
							aria-label="Like this response"
							onClick={async () => {
								setRating(1) // do an optimistic UI update
								await handleFeedback({ rating: 1 })
							}}
						/>

						<Button
							size="small"
							color="secondary"
							className={cn({ [s.rating_dislike]: rating == -1 })}
							disabled={rating == -1}
							icon={<IconThumbsDown24 height={12} width={12} />}
							aria-label="Dislike this response"
							onClick={async () => {
								setRating(-1) // do an optimistic UI update
								await handleFeedback({ rating: -1 })
							}}
						/>
					</div>

					<div
						className={cn(s.message_feedbackForm, {
							[s.message_feedbackFormVisible]: rating != 0,
						})}
					>
						{rating != 0 ? (
							<FeedbackForm
								questions={[
									{
										id: 'reason',
										type: 'text',
										label: 'Provide additional feedback to help us improve',
										placeholder:
											rating == 1
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
									await handleFeedback({ rating, text: value })
									return
								}}
							/>
						) : null}
					</div>
				</div>
			</div>

			<div className={cn(s.message_gutter)}></div>
		</div>
	)
}

// TODO(kevinwang): error styling.
const ApplicationMessage = ({ text }: { text: string }) => {
	return (
		<div className={cn(s.message, s.message_assistant)}>
			<IconTile className={cn(s.message_icon_error)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={cn(s.message_content)}>{text}</div>

			<div className={cn(s.message_gutter)}></div>
		</div>
	)
}

const ChatBox = () => {
	const {
		errorText,
		streamedText,
		messageId,
		conversationId,
		isLoading,
		stopStream,
		sendMessage,
	} = useAI()
	const { user, session } = useAuthentication()
	const accessToken = session?.accessToken

	// Text area
	const [userInput, setUserInput] = useState('')

	// List of user and assistant messages
	const [messageList, setMessageList] = useState<Message[]>([])
	const appendMessage = (message: Message) => {
		setMessageList((prev) => [...prev, message])
	}
	const resetMessageList = () => {
		setMessageList([])
	}

	// stream text into our message list
	const updateAssistantMessageByIds = ({
		conversationId,
		messageId,
		text,
	}: {
		conversationId: string
		messageId: string
		text: string
	}) => {
		setMessageList((prev) => {
			const next = [...prev]
			const assistantMessage = next.find(
				(e) =>
					e.type == 'assistant' &&
					e.messageId === messageId &&
					e.conversationId === conversationId
			)

			// update or create
			if (assistantMessage) {
				assistantMessage.text = text
			} else {
				next.push({
					type: 'assistant',
					text: text,
					messageId: messageId,
					conversationId: conversationId,
				})
			}
			return next
		})
	}

	// update component state when text is streamed in from the backend
	useEffect(() => {
		if (!streamedText || !messageId || !conversationId) {
			return
		}
		updateAssistantMessageByIds({
			conversationId,
			messageId,
			text: streamedText,
		})
	}, [streamedText, messageId, conversationId])

	const handleSubmit = async (e) => {
		const task = e.currentTarget.task?.value
		e.preventDefault()

		// Reset previous messages
		// -- Revisit this when we're ready for multi-message conversations
		resetMessageList()

		// Clear textarea
		setUserInput('')

		sendMessage({
			value: task,
			accessToken,
			// -- uncomment these parameters when we are ready for multi-message conversations
			// conversationId,
			// parentMessageId: messageId,
		})

		// append user message to list
		appendMessage({ type: 'user', text: task, image: user.image })
	}

	// Throttle this value to enable uninterrupted smooth scrolling
	const throttledText = useThrottle(streamedText, 400)

	// scroll text response to bottom as text streams in from the backend
	const textContentRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		textContentRef.current?.scrollTo({
			top: textContentRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}, [throttledText])

	// for imperatively submitting the form via textarea-enter-key
	const formRef = useRef<HTMLFormElement>(null)

	// for conditionally rendering a down arrow
	const [textContentRef2, textContentScrollBarIsVisible] = useScrollBarVisible()

	// update component state when the mutation fails
	useEffect(() => {
		if (errorText) {
			appendMessage({ type: 'application', text: errorText })
		}
	}, [errorText])

	const handleArrowDownClick = () => {
		textContentRef.current?.scrollTo({
			top: textContentRef.current.scrollHeight,
			behavior: 'smooth',
		})
	}

	return (
		<div className={cn(s.chat)}>
			{messageList.length === 0 ? (
				<WelcomeMessage />
			) : (
				<div
					ref={mergeRefs([textContentRef, textContentRef2])}
					className={s.chatbody}
				>
					{messageList.map((e, i) => {
						switch (e.type) {
							// User input
							case 'user': {
								return (
									<UserMessage
										key={`${e.type}-${i}`}
										image={e.image}
										text={e.text}
									/>
								)
							}
							// Backend AI response
							case 'assistant': {
								const shouldShowActions = e.text?.length > 20 && !isLoading
								return (
									<AssistantMessage
										markdown={e.text}
										key={e.messageId}
										conversationId={e.conversationId}
										messageId={e.messageId}
										showActions={shouldShowActions}
									/>
								)
							}
							// Application message; likely an error
							case 'application': {
								return (
									<ApplicationMessage key={`${e.type}-${i}`} text={e.text} />
								)
							}
						}
					})}
				</div>
			)}

			<form id="chat-create" onSubmit={handleSubmit} ref={formRef}>
				<div className={s.bottom}>
					{textContentScrollBarIsVisible ? (
						<div className={s.arrowdown} onClick={handleArrowDownClick}>
							<IconTile size="small">
								<IconArrowDownCircle16 />
							</IconTile>
						</div>
					) : null}

					<div className={s.question}>
						<div className={s.question_icon}>
							{isLoading ? (
								<IconLoading24 className={'loading'} />
							) : (
								<IconWand24
									style={{
										color: 'var(--token-color-foreground-highlight-on-surface)',
									}}
								/>
							)}
						</div>
						<textarea
							spellCheck={false}
							value={userInput}
							onChange={(e) => setUserInput(e.currentTarget.value)}
							onKeyDown={(e) => {
								// enter submits form; // shift+enter adds a newline
								if (e.key == 'Enter' && e.shiftKey == false) {
									if (userInput) {
										e.preventDefault()
										formRef.current.requestSubmit()
									}
								}
							}}
							id="task"
							rows={userInput.split('\n').length}
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
								onClick={stopStream}
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

					<span className={s.disclaimer}>
						AI Disclaimer: HashiCorp AI may produce inaccurate information and
						cause your computer to implode. Use at your own risk.
					</span>
				</div>
			</form>
		</div>
	)
}

const WelcomeMessage = () => {
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
