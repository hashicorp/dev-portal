import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCollections24 } from '@hashicorp/flight-icons/svg-react/collections-24'
import ButtonLink from 'components/button-link'
import Heading from 'components/heading'
import IconTile from 'components/icon-tile'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import s from './collection-meta.module.css'

const AUTH_ENABLED = __config.flags.enable_auth

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
			<Text className={s.description}>{description}</Text>
			{AUTH_ENABLED ? (
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
