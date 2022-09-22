import { Tutorial } from 'lib/learn-client/types'

export interface TutorialLibraryViewProps {
	defaultTutorials: Omit<Tutorial, 'content'>[]
}
