/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

interface CommandBarDialogProps {
	isOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogFooterProps {
	instructionsElementId: string
}

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
