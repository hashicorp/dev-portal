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
import posthog from 'posthog-js'

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

interface InstruqtContextProps {
	labId: string | null
	active: boolean
	setActive: Dispatch<SetStateAction<boolean>>
	openLab: (labId: string) => void
	closeLab: () => void
	hasConfigError: boolean
	configErrors: string[]
	productSlug?: string
}

interface InstruqtProviderProps {
	children?: ReactNode
	labId?: string
	productSlug?: string
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
})
InstruqtContext.displayName = 'InstruqtContext'

export const useInstruqtEmbed = (): InstruqtContextProps =>
	useContext(InstruqtContext)

function InstruqtProvider({
	children,
	labId: initialLabId,
	productSlug,
}: InstruqtProviderProps): JSX.Element {
	const [isClient, setIsClient] = useState(false)
	const [labId, setLabId] = useState<string | null>(initialLabId || null)
	const [active, setActive] = useState(false)
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
		if (initialLabId) {
			setLabId(initialLabId)
			setActive(false)
			return
		}
		const fallbackLabId = null
		if (productSlug && !hasConfigError) {
			const fallbackLab = SANDBOX_CONFIG.labs?.find((lab) =>
				lab.products?.includes(productSlug)
			)
			if (fallbackLab) {
				setLabId(fallbackLab.labId)
				setActive(false)
				try {
					localStorage.removeItem(STORAGE_KEY)
				} catch (e) {
					trackInstruqtError(
						'storage_remove_failed',
						'Failed to remove Instruqt lab state for fallback',
						{
							error: e instanceof Error ? e.message : String(e),
						}
					)
				}
				return
			}
		}
		if (!fallbackLabId) {
			try {
				const stored = localStorage.getItem(STORAGE_KEY)
				if (stored) {
					const { storedLabId } = JSON.parse(stored)
					if (storedLabId && !hasConfigError && !initialLabId) {
						const labExists = SANDBOX_CONFIG.labs?.some(
							(lab) => lab.labId === storedLabId
						)
						if (labExists) {
							setLabId(storedLabId)
						} else {
							localStorage.removeItem(STORAGE_KEY)
						}
					}
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
	}, [hasConfigError, initialLabId, productSlug])

	useEffect(() => {
		if (!isClient || hasConfigError) return

		if (labId) {
			try {
				localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({
						active,
						storedLabId: labId,
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
	}, [active, labId, isClient, hasConfigError])

	useEffect(() => {
		if (active && labId && !hasConfigError) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_OPEN, {
				labId,
				page: router.asPath,
			})
		}
	}, [router.asPath, active, labId, hasConfigError])

	const openLab = useCallback(
		(newLabId: string) => {
			if (hasConfigError) {
				trackInstruqtError(
					'lab_open_blocked',
					'Cannot open lab: sandbox configuration is invalid',
					{
						attempted_lab_id: newLabId,
						config_errors: configErrors,
					}
				)
				return
			}

			const labExists = SANDBOX_CONFIG.labs?.some((lab) => {
				const trackName =
					lab.instruqtTrack?.split('/').pop()?.split('?')[0] || lab.labId
				return (
					lab.labId === newLabId ||
					lab.labId === trackName ||
					trackName === newLabId.split('/').pop()?.split('?')[0] ||
					lab.instruqtTrack === newLabId ||
					lab.instruqtTrack?.split('?')[0] === newLabId.split('?')[0] ||
					(lab.scenario && newLabId.includes(lab.scenario))
				)
			})

			if (!labExists) {
				trackInstruqtError(
					'lab_not_found',
					`Lab ID "${newLabId}" not found in configuration`,
					{
						attempted_lab_id: newLabId,
						available_labs: SANDBOX_CONFIG.labs?.map((lab) => lab.labId) || [],
					}
				)
				return
			}

			if (newLabId !== labId) {
				setLabId(newLabId)
			}
		},
		[labId, hasConfigError, configErrors]
	)

	const closeLab = useCallback(() => {
		if (active && labId) {
			trackSandboxEvent(SANDBOX_EVENT.SANDBOX_CLOSED, {
				labId,
				page: router.asPath,
			})
		}
		setActive(false)
	}, [active, labId, router.asPath])

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
			}}
		>
			{children}
			{isClient && active && labId && (
				<div id="instruqt-panel-target">
					<SandboxErrorBoundary labId={labId}>
						<Resizable
							initialHeight={640}
							panelActive={active}
							setPanelActive={setActive}
							style={{}}
						>
							<EmbedElement />
						</Resizable>
					</SandboxErrorBoundary>
				</div>
			)}
		</InstruqtContext.Provider>
	)
}

export default dynamic(() => Promise.resolve(InstruqtProvider), {
	ssr: false,
})
