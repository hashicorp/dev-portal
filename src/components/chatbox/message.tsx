/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useState, useEffect, lazy } from 'react'
import classNames from 'classnames'

// https://helios.hashicorp.design/icons/library

import { IconCheckSquare24 } from '@hashicorp/flight-icons/svg-react/check-square-24'
import { IconClipboard24 } from '@hashicorp/flight-icons/svg-react/clipboard-24'
import { IconThumbsDown24 } from '@hashicorp/flight-icons/svg-react/thumbs-down-24'
import { IconThumbsUp24 } from '@hashicorp/flight-icons/svg-react/thumbs-up-24'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'
import { IconAlertDiamondFill24 } from '@hashicorp/flight-icons/svg-react/alert-diamond-fill-24'

import Button from 'components/button'
import Text from 'components/text'
import IconTile from 'components/icon-tile'
import useAuthentication from 'hooks/use-authentication'

import s from './message.module.css'

// lazily loaded due to chonky dependencies for markdown and syntax highlighting
const Markdown = lazy(() => import('./Markdown'))

const UserMessage = ({ text, image }: { text: string; image?: string }) => {
	return (
		// We want aria-live here so that when results are loaded, the user
		// with a screen reader will hear "your question" + their query
		// repeated back to them.
		<div className={classNames(s.message, s.messageUser)} aria-live="polite">
			<div className={classNames(s.avatar)}>
				{/*
					This avatar is presentation only, but the alt text here
					results in a better screen reader experience.
				*/}
				{image ? <img src={image} alt="Your question:" /> : null}
			</div>
			<Text /* Body/200/Medium */
				size={200}
				weight="medium"
				className={classNames(s.content, s.userInput)}
			>
				{text}
			</Text>
			<div className={classNames(s.gutter)}></div>
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

	const [isCopied, setIsCopied] = useState(false)
	useEffect(() => {
		let id: ReturnType<typeof setTimeout>
		if (isCopied) {
			id = setTimeout(() => {
				setIsCopied(false)
			}, 4000)
		}
		return () => {
			clearTimeout(id)
		}
	}, [isCopied])

	/** copy rich text; not raw markdown */
	const handleCopy = async () => {
		// CSS Module classname is a reasonable "hook" to grab the element
		// rendered by ReactMarkdown.
		const el = document.getElementsByClassName(s.markdown)?.[0]

		if (el) {
			// https://www.nikouusitalo.com/blog/why-isnt-clipboard-write-copying-my-richtext-html/
			const clipboardItem = new ClipboardItem({
				// @ts-expect-error - innerText is available
				'text/plain': new Blob([el.innerText], { type: 'text/plain' }),
				'text/html': new Blob([el.outerHTML], { type: 'text/html' }),
			})

			try {
				await navigator.clipboard.write([clipboardItem])
				setIsCopied(true)
			} catch (err) {
				// noop
			}
		}
	}

	return (
		<div className={classNames(s.message, s.assistant)}>
			<IconTile className={classNames(s.purple)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={classNames(s.content)}>
				<Markdown className={s.markdown} markdown={markdown} />

				<div
					className={classNames(s.assistantMessageFooter, {
						[s.assistantMessageFooterHidden]: !showActions,
					})}
				>
					<span className={s.divider} />
					<div className={s.actionButtons}>
						<Button
							size="small"
							color="secondary"
							icon={
								isCopied ? (
									<IconCheckSquare24 height={12} width={12} />
								) : (
									<IconClipboard24 height={12} width={12} />
								)
							}
							aria-label="Copy results to clipboard"
							text={isCopied ? 'Copied' : 'Copy'}
							onClick={handleCopy}
						/>

						<Button
							size="small"
							color="secondary"
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
							disabled={rating == -1}
							icon={<IconThumbsDown24 height={12} width={12} />}
							aria-label="Dislike this response"
							onClick={async () => {
								setRating(-1) // do an optimistic UI update
								await handleFeedback({ rating: -1 })
							}}
						/>
					</div>
				</div>
			</div>

			<div className={classNames(s.gutter)}></div>
		</div>
	)
}

const ApplicationMessage = ({ text }: { text: string }) => {
	return (
		<div className={classNames(s.message, s.assistant)}>
			<IconTile className={s.strong}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={s.applicationMessage}>
				<IconAlertDiamondFill24
					className={s.critical}
					style={{ width: 14, height: 14, marginTop: 2, marginBottom: 2 }}
				/>
				<Text /* Body/100/Regular */ size={100} weight="regular">
					{text}
				</Text>
			</div>
			<div className={classNames(s.gutter)}></div>
		</div>
	)
}

interface UserMessageData {
	type: 'user'
	image?: string
	text: string
}

interface AssistantMessageData {
	type: 'assistant'
	text: string
	messageId: string
	conversationId: string
	isLoading: boolean
}

interface ApplicationMessageData {
	type: 'application'
	text: string
}

export type MessageType =
	| UserMessageData
	| AssistantMessageData
	| ApplicationMessageData

// A pure, helper component that renders a list of messages, switching based on their type.
export const MessageList = ({ messages }: { messages: MessageType[] }) => {
	return (
		<>
			{messages.map((message, i) => {
				switch (message.type) {
					// User input
					case 'user': {
						return (
							<UserMessage
								key={`${message.type}-${i}`}
								image={message.image}
								text={message.text}
							/>
						)
					}
					// Backend AI response
					case 'assistant': {
						const shouldShowActions = !message.isLoading
						return (
							<AssistantMessage
								markdown={message.text}
								key={message.messageId}
								conversationId={message.conversationId}
								messageId={message.messageId}
								showActions={shouldShowActions}
								aria-live="polite"
							/>
						)
					}
					// Application message; likely an error
					case 'application': {
						return (
							<ApplicationMessage
								key={`${message.type}-${i}`}
								text={message.text}
							/>
						)
					}
				}
			})}
		</>
	)
}
