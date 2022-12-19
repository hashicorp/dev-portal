/**
 * Constants
 */
export const PROGRESS_BATCH_QUERY_ID = 'progressBatch'
export const TUTORIAL_PROGRESS_SINGLE_QUERY_ID = 'tutorialProgress'
export const COLLECTION_PROGRESS_SINGLE_QUERY_ID = 'collectionProgress'

/**
 * Hooks & Types
 */
export { useCollectionProgress } from './use-collection-progress'
export { useProgressBatchQuery } from './use-progress-batch-query'
export { useTutorialProgress } from './use-tutorial-progress'
export { useTutorialProgressMutations } from './use-tutorial-progress-mutations'
export type { TutorialProgressMutationArgs } from './use-tutorial-progress-mutations'
export { useTutorialProgressRefs } from './use-tutorial-progress-refs'
