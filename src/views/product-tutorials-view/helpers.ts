/**
 * takes db collection slug format --> waypoint/get-started
 * and turns it to --> waypoint/tutorials/get-started
 */

export function getCollectionSlug(dbslug: string): string {
  const [product, collectionFilename] = dbslug.split('/')
  return `/${product}/tutorials/${collectionFilename}`
}
