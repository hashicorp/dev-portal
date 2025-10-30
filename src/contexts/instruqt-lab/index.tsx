/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	useState,
	createContext,
	useContext,
	ReactNode,
	Dispatch,
	SetStateAction,
	useEffect,
	useCallback,
} from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import EmbedElement from 'components/lab-embed/embed-element'
import Resizable from 'components/lab-embed/resizable'
import SandboxErrorBoundary from 'components/sandbox-error-boundary'
import { trackSandboxEvent, SANDBOX_EVENT } from 'lib/posthog-events'
import { validateSandboxConfigWithDetailedErrors } from 'lib/validate-sandbox-config'
import SANDBOX_CONFIG from 'content/sandbox/sandbox.json' assert { type: 'json' }

// SSR-safe dynamic import
let posthog: typeof import('posthog-js').default | null = null
if (typeof window !== 'undefined') {
	import('posthog-js').then((module) => {
		posthog = module.default
	})
}

/**
 * Tracks Instruqt context errors with PostHog and development logging
 */
function trackInstruqtError(
	errorType: string,
	errorMessage: string,
	context?: Record<string, unknown>
) {
	posthog.capture('instruqt_context_error', {
		error_type: errorType,
		error_message: errorMessage,
		timestamp: new Date().toISOString(),
		page_url: window.location.href,
		...context,
	})

	if (process.env.NODE_ENV === 'development') {
		if (errorType.includes('warning') || errorType.includes('storage')) {
			console.warn(`[InstruqtContext] ${errorMessage}`, context)
		} else {
			console.error(`[InstruqtContext] ${errorMessage}`, context)
		}
	}
}

type LabSource = 'tutorial' | 'sandbox'

interface InstruqtContextProps {
	labId: string | null
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
	openLab: (labId: string, source?: LabSource) => void
	closeLab: () => void
	hasConfigError: boolean
	configErrors: string[]
	productSlug?: string
	labSource: LabSource | null
	tutorialLabId?: string | null
}

interface InstruqtProviderProps {
	children?: ReactNode
	labId?: string
	productSlug?: string
	source?: LabSource
}

const STORAGE_KEY = 'instruqt-lab-state'

const InstruqtContext = createContext<InstruqtContextProps>({
	labId: null,
	active: false,
	setActive: () => {},
	openLab: () => {},
	closeLab: () => {},
	hasConfigError: false,
	configErrors: [],
	productSlug: undefined,
	labSource: null,
	tutorialLabId: null,
})
InstruqtContext.displayName = 'InstruqtContext'

export const useInstruqtEmbed = (): InstruqtContextProps =>
	useContext(InstruqtContext)

function InstruqtProvider({
	children,
	labId: initialLabId,
	productSlug,
	source = 'sandbox',
}: InstruqtProviderProps): JSX.Element {
	const [isClient, setIsClient] = useState(false)
	const [labId, setLabId] = useState<string | null>(initialLabId || null)
	const [active, setActive] = useState(false)
	const [labSource, setLabSource] = useState<LabSource | null>(source)
	const [hasConfigError, setHasConfigError] = useState(false)
	const [configErrors, setConfigErrors] = useState<string[]>([])
	const router = useRouter()
	useEffect(() => {
		const validation = validateSandboxConfigWithDetailedErrors(SANDBOX_CONFIG)

		if (!validation.isValid) {
			setHasConfigError(true)
			setConfigErrors(validation.errors)

			trackInstruqtError(
				'config_validation_failed',
				'Sandbox configuration validation failed',
				{
					errors: validation.errors,
					error_count: validation.errors.length,
				}
			)

			posthog.capture('sandbox_config_error', {
				errors: validation.errors,
				timestamp: new Date().toISOString(),
			})
		} else if (validation.warnings.length > 0) {
			trackInstruqtError(
				'config_warnings',
				'Sandbox configuration has warnings',
				{
					warnings: validation.warnings,
					warning_count: validation.warnings.length,
				}
			)
		}
	}, [])

	useEffect(() => {
		setIsClient(true)

		let restoredLabId: string | null = null
		let restoredActive = false
		let restoredSource: LabSource = 'sandbox'

		if (source === 'sandbox') {
			try {
				const stored = localStorage.getItem(STORAGE_KEY)
				if (stored) {
					const parsed = JSON.parse(stored)
					restoredLabId = parsed.storedLabId
					restoredActive = parsed.active || false
					restoredSource = parsed.source || 'sandbox'
				}
			} catch (e) {
				trackInstruqtError(
					'storage_restore_failed',
					'Failed to restore Instruqt lab state',
					{
						error: e instanceof Error ? e.message : String(e),
					}
				)
				try {
					localStorage.removeItem(STORAGE_KEY)
				} catch (clearError) {
					trackInstruqtError(
						'storage_clear_failed',
						'Failed to clear corrupted storage',
						{
							error:
								clearError instanceof Error
									? clearError.message
									: String(clearError),
						}
					)
				}
			}
		}

		if (initialLabId) {
			setLabId(initialLabId)
			setLabSource(source)
			if (
				source === 'sandbox' &&
				restoredActive &&
				restoredLabId === initialLabId
			) {
				setActive(true)
			}
			if (source === 'tutorial') {
				try {
					localStorage.removeItem(STORAGE_KEY)
				} catch (e) {
					trackInstruqtError(
						'storage_clear_failed',
						'Failed to clear persisted sandbox on tutorial page load',
						{
							error: e instanceof Error ? e.message : String(e),
						}
					)
				}
			}
		} else if (source === 'sandbox' && restoredLabId && !hasConfigError) {
			setLabId(restoredLabId)
			setLabSource(restoredSource)
			setActive(restoredActive)
		} else if (source === 'tutorial') {
			// Tutorial page with no lab - ensure nothing is persisted
			try {
				localStorage.removeItem(STORAGE_KEY)
			} catch (e) {
				trackInstruqtError(
					'storage_clear_failed',
					'Failed to clear persisted sandbox on tutorial page without lab',
					{
						error: e instanceof Error ? e.message : String(e),
					}
				)
			}
		}
	}, [hasConfigError, initialLabId, productSlug, source])

	useEffect(() => {
		if (!isClient || hasConfigError) return

		if (labSource === 'sandbox') {
			if (labId) {
				try {
					localStorage.setItem(
						STORAGE_KEY,
						JSON.stringify({
							active,
							storedLabId: labId,
							source: labSource,
						})
					)
				} catch (e) {
					trackInstruqtError(
						'storage_persist_failed',
						'Failed to persist Instruqt lab state',
						{
							error: e instanceof Error ? e.message : String(e),
							active,
							labId,
						}
					)
				}
			} else {
				try {
					localStorage.removeItem(STORAGE_KEY)
				} catch (e) {
					trackInstruqtError(
						'storage_remove_failed',
						'Failed to remove Instruqt lab state',
						{
							error: e instanceof Error ? e.message : String(e),
						}
					)
				}
			}
		} else if (labSource === 'tutorial') {
			if (active && labId) {
				try {
					localStorage.removeItem(STORAGE_KEY)
				} catch (e) {
					trackInstruqtError(
						'storage_remove_failed',
						'Failed to remove sandbox state when tutorial lab opened',
						{
							error: e instanceof Error ? e.message : String(e),
						}
					)
				}
			}
		}
	}, [active, labId, labSource, isClient, hasConfigError])

	useEffect(() => {
		if (active && labId && !hasConfigError) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
				labId,
				page: router.asPath,
			})
		}
	}, [router.asPath, active, labId, hasConfigError])

	useEffect(() => {
		if (labSource === 'tutorial' && active) {
			setActive(false)
			setLabId(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.asPath])

	const openLab = useCallback(
		(newLabId: string, newSource: LabSource = 'sandbox') => {
			setLabId(newLabId)
			setLabSource(newSource)
			setActive(true)
		},
		[]
	)

	const closeLab = useCallback(() => {
		if (active && labId) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_CLOSED, {
				labId,
				page: router.asPath,
			})
		}
		setActive(false)
		if (labSource === 'tutorial') {
			setLabId(null)
		}
	}, [active, labId, labSource, router.asPath])

	if (hasConfigError) {
		return (
			<InstruqtContext.Provider
				value={{
					labId: null,
					active: false,
					setActive: () => {},
					openLab: () => {},
					closeLab: () => {},
					hasConfigError,
					configErrors,
					labSource: null,
					tutorialLabId: null,
				}}
			>
				{children}
			</InstruqtContext.Provider>
		)
	}

	return (
		<InstruqtContext.Provider
			value={{
				labId,
				active,
				setActive,
				openLab,
				closeLab,
				hasConfigError,
				configErrors,
				productSlug,
				labSource,
				tutorialLabId: source === 'tutorial' ? initialLabId : null,
			}}
		>
			{children}
			{isClient && active && labId && (
				<div id="instruqt-panel-target" key={labId}>
					<SandboxErrorBoundary labId={labId}>
						<Resizable
							initialHeight={640}
							panelActive={active}
							setPanelActive={setActive}
							style={{}}
						>
							<EmbedElement key={labId} />
						</Resizable>
					</SandboxErrorBoundary>
				</div>
			)}
		</InstruqtContext.Provider>
	)
}

export { InstruqtProvider }
export type { LabSource }

export default dynamic(() => Promise.resolve(InstruqtProvider), {
	ssr: false,
})
