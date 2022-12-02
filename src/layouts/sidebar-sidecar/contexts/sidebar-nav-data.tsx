import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useMobileMenu } from 'contexts'
import { SidebarProps } from 'components/sidebar'

interface State {
	currentLevel: number
	hasManyLevels: boolean
	isFirstLevel: boolean
	isLastLevel: boolean
	mobileMenuIsOpen: boolean
	setCurrentLevel: Dispatch<SetStateAction<number>>
	setMobileMenuIsOpen: Dispatch<SetStateAction<boolean>>
	shouldRenderMobileControls: boolean
}

const SidebarNavDataContext = createContext<State | undefined>(undefined)
SidebarNavDataContext.displayName = 'SidebarNavDataContext'

interface SidebarNavDataProviderProps {
	children: ReactNode
	navDataLevels: SidebarProps[]
}

const SidebarNavDataProvider = ({
	children,
	navDataLevels,
}: SidebarNavDataProviderProps) => {
	const { mobileMenuIsOpen, setMobileMenuIsOpen, isMobileMenuRendered } =
		useMobileMenu()
	const numberOfLevels = navDataLevels.length
	const [currentLevel, setCurrentLevel] = useState<number>(numberOfLevels - 1)

	/**
	 * Reset if the current level once the mobile menu is closed and also if the
	 * `navDataLevels` prop has changed.
	 */
	useEffect(() => {
		// Should not alter current level after opening the mobile menu
		if (mobileMenuIsOpen) {
			return
		}

		// Rest to the last/lowest level
		setCurrentLevel(numberOfLevels - 1)
	}, [mobileMenuIsOpen, navDataLevels, numberOfLevels])

	// Derive booleans based on main state
	const hasManyLevels = numberOfLevels > 1
	const isFirstLevel = currentLevel === 0
	const isLastLevel = currentLevel === numberOfLevels - 1
	const shouldRenderMobileControls = hasManyLevels && isMobileMenuRendered

	// Create state object to pass to the Provider
	const state: State = {
		currentLevel,
		hasManyLevels,
		isFirstLevel,
		isLastLevel,
		mobileMenuIsOpen,
		setCurrentLevel,
		setMobileMenuIsOpen,
		shouldRenderMobileControls,
	}

	return (
		<SidebarNavDataContext.Provider value={state}>
			{children}
		</SidebarNavDataContext.Provider>
	)
}

const useSidebarNavData = () => {
	const context = useContext(SidebarNavDataContext)
	if (context === undefined) {
		throw new Error(
			'useSidebarNavData must be used within a SidebarNavDataProvider'
		)
	}

	return context
}

export { SidebarNavDataProvider, useSidebarNavData }
