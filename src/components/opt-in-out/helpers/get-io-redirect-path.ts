export function getIoRedirectPath(path: string) {
  // given /waypoint/docs/blah, return docs/blah
  return path.split('/').slice(2).join('/')
}
