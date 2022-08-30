import { ConnectTutorialProgressComponent } from '../connect-collection-progress-component'
import s from './collection-progress-bar.module.css'

/**
 * TODO: implement this properly
 */
function CollectionProgressBar({ completedTutorialCount, totalTutorialCount }) {
	return (
		<span className={s.root}>
			DONE:{completedTutorialCount}/{totalTutorialCount}
		</span>
	)
}

export default ConnectTutorialProgressComponent(CollectionProgressBar)
