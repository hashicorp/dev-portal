import { ReactNode } from 'react'
import DirectionalLinkBox from './components/directional-link-box'
import { NextPreviousProps, LinkProps } from './types'
import s from './next-previous.module.css'

function NextPrevious({ tutorial, collection, finalLink }: NextPreviousProps) {
  const hasPrevTutorial = tutorial.previous

  /**
   * Determine what to render in the previous slot.
   */
  let previousSlot: ReactNode
  if (hasPrevTutorial) {
    /* If we can, link to the previous tutorial in the collection */
    previousSlot = <PrevTutorial {...tutorial.previous} />
  } else {
    /* If there's no previous tutorial, link back to the current collection */
    previousSlot = <BackToCollection {...collection.current} />
  }

  /**
   * Determine what to render in the next slot
   *
   * TODO: is there ever a situation where tutorial.next exists,
   * BUT tutorial.isLast is true? That seems unexpected.
   * Maybe this could just check "tutorial.next"? Similarly...
   *
   * TODO: is there ever a situation where collection.next exists,
   * BUT collection.isLast is true? That seems unexpected.
   * Maybe this could just check "collection.next"?
   */
  let nextSlot: ReactNode
  const hasNextTutorial = tutorial.next && !tutorial.isLast
  const hasNextCollection = collection.next && !collection.isLast
  if (hasNextTutorial) {
    /* If we can, link to the next tutorial in the collection */
    nextSlot = <NextTutorial {...tutorial.next} />
  } else if (hasNextCollection) {
    /* If there's no next tutorial, but a next collection, link to that */
    nextSlot = <NextCollection {...collection.next} />
  } else {
    /* If there's no next tutorial or next collection, link to "Browse" */
    nextSlot = <BrowseTutorials href={finalLink} />
  }

  return (
    <div className={s.root}>
      {previousSlot}
      {nextSlot}
    </div>
  )
}

/**
 * Link to the next tutorial
 */
function NextTutorial({ path, name }: LinkProps) {
  return (
    <DirectionalLinkBox
      label="Next"
      href={path}
      direction="next"
      ariaLabel={`Go to next tutorial: ${name}`}
    />
  )
}

/**
 * Link to the previous tutorial
 */
function PrevTutorial({ path, name }: LinkProps) {
  return (
    <DirectionalLinkBox
      label="Previous"
      href={path}
      direction={'previous'}
      ariaLabel={`Go to previous tutorial: ${name}`}
    />
  )
}

/**
 * Link "back" to the current collection.
 */
function BackToCollection({ path, name }: LinkProps) {
  return (
    <DirectionalLinkBox
      href={path}
      label="Back to Collection"
      direction={'previous'}
      ariaLabel={`Go back to collection: ${name}`}
    />
  )
}

/**
 * Link to the next collection.
 */
function NextCollection({ path, name }: LinkProps) {
  return (
    <DirectionalLinkBox
      href={path}
      label="Next Collection"
      direction="next"
      ariaLabel={`Go to next collection: ${name}`}
    />
  )
}

/**
 * Link to browse all tutorials.
 *
 * @TODO - interim state for 'final' link
 * This link shows on the last tutorial in the last collection in sidebar order
 * In learn, it links to a filtered advanced search page state
 * e.g. https://learn.hashicorp.com/search?product=waypoint&page=1
 *
 * Since don't have an advanced search page for beta,
 * were linking folks back to the base
 * product tutorials page.
 */
function BrowseTutorials({ href }: { href: string }) {
  return (
    <DirectionalLinkBox
      href={href}
      label="Browse Tutorials"
      direction="final"
      ariaLabel="Browse Tutorials"
    />
  )
}

export type { NextPreviousProps }
export { NextPrevious }
