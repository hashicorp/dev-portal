import { createContext, useContext, useEffect, useState } from 'react'
import getCSSVariableFromDocument from 'lib/get-css-variable-from-document'

const DEFAULT_MOBILE_WIDTH = 728
const DEFAULT_TABLET_WIDTH = 1000

interface DeviceSize {
	isDesktop?: boolean
	isMobile?: boolean
	isTablet?: boolean
}

const DeviceSizeContext = createContext<DeviceSize>(undefined)
DeviceSizeContext.displayName = 'DeviceSizeContext'

const DeviceSizeProvider: React.FC = ({ children }) => {
	let mobileWidth: number
	let tabletWidth: number
	let mobileMediaQueryListObject: MediaQueryList
	let tabletMediaQueryListObject: MediaQueryList

	if (typeof window !== 'undefined') {
		mobileWidth =
			(getCSSVariableFromDocument('--mobile-width-breakpoint', {
				asNumber: true,
			}) as number) || DEFAULT_MOBILE_WIDTH
		tabletWidth =
			(getCSSVariableFromDocument('--tablet-width-breakpoint', {
				asNumber: true,
			}) as number) || DEFAULT_TABLET_WIDTH

		mobileMediaQueryListObject = window.matchMedia(
			`(max-width: ${mobileWidth}px)`
		)
		tabletMediaQueryListObject = window.matchMedia(
			`(min-width: ${mobileWidth + 1}px) and (max-width: ${tabletWidth}px)`
		)
	}

	const getDerivedState = () => {
		const isMobile = mobileMediaQueryListObject?.matches
		const isTablet = tabletMediaQueryListObject?.matches
		const isDesktop = !(isMobile || isTablet)
		return {
			isDesktop,
			isMobile,
			isTablet,
		}
	}

	const [value, setValue] = useState<DeviceSize>(() => getDerivedState())

	useEffect(() => {
		const handleChange = () => {
			setValue(getDerivedState())
		}

		mobileMediaQueryListObject.addEventListener('change', handleChange)
		tabletMediaQueryListObject.addEventListener('change', handleChange)

		return () => {
			mobileMediaQueryListObject.removeEventListener('change', handleChange)
			tabletMediaQueryListObject.removeEventListener('change', handleChange)
		}
	})

	return (
		<DeviceSizeContext.Provider value={value}>
			{children}
		</DeviceSizeContext.Provider>
	)
}

const useDeviceSize = (): DeviceSize => {
	const context = useContext(DeviceSizeContext)
	if (context === undefined) {
		throw new Error('useDeviceSize must be used within a DeviceSizeProvider')
	}

	return context
}

export { DeviceSizeProvider, useDeviceSize }
