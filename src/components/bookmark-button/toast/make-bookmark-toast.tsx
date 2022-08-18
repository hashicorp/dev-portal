import { IconBookmarkAdd24 } from '@hashicorp/flight-icons/svg-react/bookmark-add-24'
import { IconBookmarkRemove24 } from '@hashicorp/flight-icons/svg-react/bookmark-remove-24'
import { toast } from 'components/toast'
import s from './bookmark-toast.module.css'

type ToastAction = 'add' | 'remove'
type ToastActionConfig = Record<
	ToastAction,
	{
		title: string
		descriptionSuffix: string
		icon: JSX.IntrinsicElements['svg']
	}
>

const toastActionConfig: ToastActionConfig = {
	add: {
		title: 'Bookmark Added',
		descriptionSuffix: 'has been added to your bookmarks.',
		icon: <IconBookmarkAdd24 className={s.toastIcon} />,
	},
	remove: {
		title: 'Bookmark Removed',
		descriptionSuffix: 'has been removed from your bookmarks.',
		icon: <IconBookmarkRemove24 className={s.toastIcon} />,
	},
}

function generateToastMessage(actionType: ToastAction, tutorialName?: string) {
	const tutorialNameDefault = 'This tutorial'

	return {
		title: toastActionConfig[actionType].title,
		description: `${tutorialName || tutorialNameDefault} ${
			toastActionConfig[actionType].descriptionSuffix
		}`,
		icon: toastActionConfig[actionType].icon,
	}
}

export default function makeBookmarkToast(
	action: ToastAction,
	tutorialName?: string
) {
	toast({
		...generateToastMessage(action, tutorialName),
		autoDismiss: 15000,
	})
}
