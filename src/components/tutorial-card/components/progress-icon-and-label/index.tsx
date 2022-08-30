import { ConnectTutorialProgressComponent } from '../connect-tutorial-progress-component'
import s from './progress-icon-and-label.module.css'

/**
 * TODO: implement this, it should be like TutorialCardBookmarkButton,
 * but hooked up to progress data.
 */
function ProgressIconAndLabel({ tutorialProgressLabel }) {
	return <span className={s.root}>STATUS:{tutorialProgressLabel}</span>
}

export default ConnectTutorialProgressComponent(ProgressIconAndLabel)
