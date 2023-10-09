/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React, { useEffect, useState, useRef } from 'react'

// https://helios.hashicorp.design/icons/library
import { IconArrowDownCircle16 } from '@hashicorp/flight-icons/svg-react/arrow-down-circle-16'
import { IconLoading24 } from '@hashicorp/flight-icons/svg-react/loading-24'
import { IconSend24 } from '@hashicorp/flight-icons/svg-react/send-24'
import { IconStopCircle24 } from '@hashicorp/flight-icons/svg-react/stop-circle-24'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'
import classNames from 'classnames'
import ms from 'ms'
import { z } from 'zod'

import { useMutation } from '@tanstack/react-query'

import useAuthentication from 'hooks/use-authentication'
import Button from 'components/button'

import Text from 'components/text'

import s from './chatbox.module.css'
import { MessageList, type MessageType } from './message'
import { WelcomeMessage } from './welcome-message'

import {
	streamToAsyncIterable,
	mergeRefs,
	useScrollBarVisible,
	useThrottle,
} from './utils'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const useAI = () => {
	// We'll call `update` to retrieve a new access token if the current one is expired
	// and we receive a 401 from the backend.
	const { update, session } = useAuthentication()
	const token = session?.accessToken

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
		mutationFn: async ({ value: task, conversationId, parentMessageId }) => {
			// call our edge function which is capable of streaming
			const request = async (jwt: string) => {
				const res = await fetch('/api/chat/route', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ task, conversationId, parentMessageId }),
				})
				return res
			}

			let response = await request(token)

			if (response.ok) {
				// messageId and conversationId are noops until we are ready for multi-message conversations
				setConversationId(response.headers.get('x-conversation-id'))
				setMessageId(response.headers.get('x-message-id'))
				return response
			} else {
				// if the response is not ok
				// if the response is a 401, we need to refresh the access token and retry once.
				// otherwise, throw the response
				if (response.status == 401) {
					const { accessToken } = await update()
					response = await request(accessToken)
					if (response.ok) {
						return response
					}
				}
				throw response
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

				for await (const { event, data, raw } of iter) {
					const parseResult = messageFormat.safeParse(JSON.parse(data))
					if (!parseResult.success) {
						// malformatted message
						continue
					} else {
						const { content } = parseResult.data

						// call sleep(0) to opt out of react's state update batching
						// this allows the text to appear to stream-in smoothly
						await sleep(0)
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
	const { user } = useAuthentication()

	// Text area
	// Note: We are not re-using the command bar's input state as we intentionally
	// want the "search" & "AI" UX to be separate.
	const [userInput, setUserInput] = useState('')

	// List of user and assistant messages
	const [messageList, setMessageList] = useState<MessageType[]>([])
	const appendMessage = (message: MessageType) => {
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
		isLoading,
	}: {
		conversationId: string
		messageId: string
		text: string
		isLoading: boolean
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
				// @ts-expect-error - Ignore TS not being able to narrow down here
				assistantMessage.isLoading = isLoading
			} else {
				next.push({
					type: 'assistant',
					text: text,
					messageId: messageId,
					conversationId: conversationId,
					isLoading: true,
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
			isLoading,
		})
	}, [streamedText, messageId, conversationId, isLoading])

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
		<div className={classNames(s.chat)}>
			{messageList.length === 0 ? (
				<WelcomeMessage />
			) : (
				<div
					ref={mergeRefs([textContentRef, textContentRef2])}
					className={s.messageList}
				>
					<MessageList messages={messageList} />
				</div>
			)}

			<form onSubmit={handleSubmit} ref={formRef}>
				<div className={s.bottom}>
					{textContentScrollBarIsVisible && !isLoading ? (
						<Button
							className={s.arrowdown}
							icon={<IconArrowDownCircle16 />}
							onClick={handleArrowDownClick}
							aria-label="Scroll to bottom"
							color="secondary"
						/>
					) : null}

					<div className={s.question}>
						<div className={s.questionIcon}>
							{isLoading ? (
								<IconLoading24 className={'loading'} />
							) : (
								<IconWand24 className={s.purple} />
							)}
						</div>
						<textarea
							aria-label="Ask AI a question"
							aria-describedby="user-instructions"
							autoFocus
							className={classNames(s.reset, s.textarea)}
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
							placeholder="Ask a question"
							disabled={isLoading}
						/>
						<span id="user-instructions" className="g-screen-reader-only">
							The question can be 200 characters long.
						</span>
						<div className={s.buttonContainer}>
							{isLoading ? (
								<Button
									type={'button'}
									icon={<IconStopCircle24 height={16} width={16} />}
									text={'Stop generating'}
									color={'secondary'}
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
					</div>

					<Text
						asElement="span"
						className={s.disclaimer}
						/* Display/100/Regular */
						size={100}
						weight="regular"
						id="ai-disclaimer-text"
					>
						AI Disclaimer: Content generated by Developer AI may contain errors,
						inconsistencies, or outdated information. It is provided as-is
						without any warranties or guarantees of accuracy. Use of this
						feature and related content is governed by HashiCorp’s AI Policy.
					</Text>
				</div>
			</form>
		</div>
	)
}

export default ChatBox
