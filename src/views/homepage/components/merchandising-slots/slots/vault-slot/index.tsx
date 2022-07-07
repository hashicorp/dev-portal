import Image from 'next/image'
import VisuallyHidden from '@reach/visually-hidden'
import logo from '@hashicorp/mktg-logos/product/vault/primary/color.svg'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CardLink from 'components/card-link'
import Text from 'components/text'
import { VaultSlotProps } from './types'
import s from './vault-slot.module.css'

function VaultSlot({ url, cardTitle, description, ctaText }: VaultSlotProps) {
	return (
		<CardLink href={url} className={s.root}>
			<VisuallyHidden as="h2">{cardTitle}</VisuallyHidden>
			<div className={s.logo}>
				<Image src={logo} width={118} height={50} alt="" />
			</div>
			<Text className={s.description} weight="bold">
				{description}
			</Text>
			<p className={s.cta}>
				{ctaText} <IconArrowRight16 />
			</p>
		</CardLink>
	)
}

export { VaultSlot }
