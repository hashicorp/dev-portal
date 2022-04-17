import Button from 'components/button'
import Sidebar, { SidebarProps } from 'components/sidebar'
import { useState } from 'react'

interface MobileDocsSidebar {
  levels: SidebarProps[]
}

const MobileDocsSidebar = ({ levels }: MobileDocsSidebar) => {
  const numberOfLevels = levels.length
  const [currentLevel, setCurrentLevel] = useState(numberOfLevels - 1)
  const currentLevelSidebarProps = levels[currentLevel]

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 48,
        }}
      >
        <Button
          disabled={currentLevel === 0}
          text="Up"
          onClick={() => setCurrentLevel(currentLevel - 1)}
        />
        <Button
          disabled={currentLevel === numberOfLevels - 1}
          text="Down"
          onClick={() => setCurrentLevel(currentLevel + 1)}
        />
      </div>
      <Sidebar {...currentLevelSidebarProps} />
    </div>
  )
}

export default MobileDocsSidebar
