import { TutorialFullCollectionCtx as ClientTutorial } from 'lib/learn-client/types'

// @TODO update this interface once we have a better idea of the page needs
export default function TutorialView(
  props: ClientTutorial
): React.ReactElement {
  return (
    <>
      <h1>{props.name}</h1>
      <div>{props.content}</div>
    </>
  )
}
