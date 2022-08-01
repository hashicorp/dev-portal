import { ReactElement } from 'react'
import { ProductSlug } from 'types/products'

type SupportedIconName = 'home' | ProductSlug

interface NavigationItemContentProps {
  badge?: $TSFixMe
  leadingIconName?: SupportedIconName
  text: string
  trailingIcon?: ReactElement
}

export type { NavigationItemContentProps, SupportedIconName }
