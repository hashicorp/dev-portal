import type { ComponentProps } from 'react'
import NextLink from 'next/link'

interface LinkProps extends ComponentProps<typeof NextLink> {
	opensInNewTab?: boolean
}

export type { LinkProps }
