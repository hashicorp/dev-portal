import { useState, useEffect } from 'react'
import cn from 'classnames'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import { MdxPre } from 'components/dev-dot-content/mdx-components/mdx-code-blocks'

// https://helios.hashicorp.design/icons/library

import { IconCheckSquare24 } from '@hashicorp/flight-icons/svg-react/check-square-24'
import { IconClipboard24 } from '@hashicorp/flight-icons/svg-react/clipboard-24'
import { IconThumbsDown24 } from '@hashicorp/flight-icons/svg-react/thumbs-down-24'
import { IconThumbsUp24 } from '@hashicorp/flight-icons/svg-react/thumbs-up-24'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'

import Button from 'components/button'
import Text from 'components/text'
import FeedbackForm from 'components/feedback-form'
import IconTile from 'components/icon-tile'
import useAuthentication from 'hooks/use-authentication'

import s from './message.module.css'

export const UserMessage = ({
	text,
	image,
}: {
	image?: string
	text: string
}) => {
	return (
		<div className={cn(s.message, s.message_user)}>
			<div className={cn(s.message_avatar)}>
				{image ? <img src={image} alt="user avatar" /> : null}
			</div>
			<Text /* Body/200/Medium */
				size={200}
				weight="medium"
				className={cn(s.message_content, s.message_user_input)}
			>
				{text}
			</Text>
			<div className={cn(s.message_gutter)}></div>
		</div>
	)
}

export const AssistantMessage = ({
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
	const handleCopy = () => {
		// CSS Module classname is a reasonable "hook" to grab the element
		// rendered by ReactMarkdown.
		const el = document.getElementsByClassName(s.message_markdown)?.[0]

		if (el) {
			// https://www.nikouusitalo.com/blog/why-isnt-clipboard-write-copying-my-richtext-html/
			const clipboardItem = new ClipboardItem({
				// @ts-expect-error - innerText is available
				'text/plain': new Blob([el.innerText], { type: 'text/plain' }),
				'text/html': new Blob([el.outerHTML], { type: 'text/html' }),
			})

			navigator.clipboard.write([clipboardItem])
			setIsCopied(true)
		}
	}

	return (
		<div className={cn(s.message, s.message_assistant)}>
			<IconTile className={cn(s.message_icon)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<div className={cn(s.message_content)}>
				<ReactMarkdown
					className={s.message_markdown}
					components={{
						// @ts-expect-error - ignore this type incompatibility
						pre: MdxPre,
						p: (props) => (
							<Text /* Body/200/Medium */
								size={200}
								weight="medium"
								{...props}
							/>
						),
					}}
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
							icon={
								isCopied ? (
									<IconCheckSquare24 height={12} width={12} />
								) : (
									<IconClipboard24 height={12} width={12} />
								)
							}
							aria-label="Copy to clipboard"
							text={isCopied ? 'Copied' : 'Copy'}
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
export const ApplicationMessage = ({ text }: { text: string }) => {
	return (
		<div className={cn(s.message, s.message_assistant)}>
			<IconTile className={cn(s.message_icon_error)}>
				<IconWand24 style={{ width: 24, height: 24 }} />
			</IconTile>
			<Text /* Body/200/Medium */
				size={200}
				weight="medium"
				className={cn(s.message_content)}
			>
				{text}
			</Text>
			<div className={cn(s.message_gutter)}></div>
		</div>
	)
}
