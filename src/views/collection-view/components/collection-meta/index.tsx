import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import useAuthentication from 'hooks/use-authentication'
import ButtonLink from 'components/button-link'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import s from './collection-meta.module.css'

interface CollectionMetaProps {
	heading: {
		text: string
		id: string
	}
	description: string
	numTutorials: number
	cta: {
		href: string
	}
}

export default function CollectionMeta({
	heading,
	description,
	cta,
	numTutorials,
}: CollectionMetaProps) {
	const ctaText = `${numTutorials} ${
		numTutorials > 1 ? `tutorials` : `tutorial`
	}`

	/**
	 * We only need to show the Create Account CTA if auth is enabled and there is
	 * not already a user authenticated.
	 */
	const { isAuthenticated, isAuthEnabled, isLoading } = useAuthentication()
	const showCreateAccountCta = isAuthEnabled && !isLoading && !isAuthenticated

	return (
		<>
			<IconTile>
				<IconCollections24 className={s.icon} />
			</IconTile>
			<Heading
				level={1}
				size={500}
				weight="bold"
				id={heading.id}
				className={s.heading}
			>
				{heading.text}
			</Heading>
			<p
				className={s.description}
				dangerouslySetInnerHTML={{
					__html: description,
				}}
			/>
			{showCreateAccountCta ? (
				<Text className={s.createAccountCta}>
					<InlineLink href="/sign-up">Create an account</InlineLink> to track
					your progress.
				</Text>
			) : null}
			<div className={s.cta}>
				<ButtonLink
					aria-label="Start first tutorial"
					href={cta.href}
					text="Start"
				/>
				<span className={s.ctaText}>
					<IconCollections16 className={s.ctaIcon} />
					<Text size={100}>{ctaText}</Text>
				</span>
			</div>
		</>
	)
}
