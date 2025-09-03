import { useMemo, useState, useCallback, useEffect } from 'react'
import FocusLock from 'react-focus-lock'
import { Dialog } from '../dialog-primitive'
import { ModalContext, useModal } from './use-modal'
import type { ReactNode } from 'react'
import type { ModalContextState } from './use-modal'
import s from './modal.module.css'

interface ModalProps {
	initialIsOpen?: boolean
	initialModalContent?: ReactNode
	onClose?: () => void
	children: ReactNode
}

const ModalProvider = ({
	onClose,
	initialIsOpen = false,
	initialModalContent = null,
	children,
}: ModalProps) => {
	const [modalContent, setModalContent] = useState<ReactNode | null>(
		initialModalContent
	)
	const [isOpen, setIsOpen] = useState(initialIsOpen)

	const closeModal = useCallback(() => {
		setIsOpen(false)
		setModalContent(null)
		if (onClose) {
			onClose()
		}
	}, [setIsOpen, onClose])

	const openModal = useCallback(
		(content: ReactNode) => {
			setModalContent(content)
			setIsOpen(true)
		},
		[setIsOpen]
	)

	const contextValue: ModalContextState = useMemo(
		() => ({
			isOpen,
			openModal,
			modalContent,
			closeModal,
		}),
		[isOpen, openModal, closeModal, modalContent]
	)

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				closeModal()
			}
		}
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}

		return () => {
			if (isOpen) {
				window.removeEventListener('keydown', handleKeyDown)
			}
		}
	}, [isOpen, closeModal])

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
			{isOpen && modalContent && (
				<>
					<FocusLock>
						<Dialog.Wrapper
							onDismiss={closeModal}
							className={s.modal}
							open={isOpen}
						>
							{modalContent}
						</Dialog.Wrapper>
					</FocusLock>
					<Dialog.Overlay />
				</>
			)}
		</ModalContext.Provider>
	)
}

export { useModal, ModalProvider }
