import Sidebar, { SidebarProps } from 'components/sidebar'
import { useState } from 'react'

interface MobileDocsSidebar {
  levels: SidebarProps[]
}

const MobileDocsSidebar = ({ levels }: MobileDocsSidebar) => {
  const numberOfLevels = levels.length
  const [currentLevel, setCurrentLevel] = useState<number>(numberOfLevels - 1)
  const currentLevelSidebarProps = levels[currentLevel]

  let levelButtonProps
  if (currentLevel === 0 && numberOfLevels > 1) {
    levelButtonProps = {
      text: 'Waypoint Home',
      iconPosition: 'trailing',
      onClick: () => setCurrentLevel(1),
    }
  } else if (currentLevel === 1) {
    levelButtonProps = {
      text: 'Back to Developer',
      iconPosition: 'leading',
      onClick: () => setCurrentLevel(0),
    }
  } else if (currentLevel === 2) {
    levelButtonProps = {
      text: 'Back to Waypoint',
      iconPosition: 'leading',
      onClick: () => setCurrentLevel(1),
    }
  }

  return (
    <div
      style={{
        width: 320,
        height: 900,
        padding: 24,
        paddingTop: 32,
        border: '1px solid black',
        overflowY: 'scroll',
      }}
    >
      <Sidebar
        {...currentLevelSidebarProps}
        levelButtonProps={levelButtonProps}
      />
    </div>
  )
}

export default MobileDocsSidebar
