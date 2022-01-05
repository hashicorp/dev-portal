import HomePage from 'views/waypoint/home'
import server from 'views/waypoint/home/server'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  return await server.getStaticProps()
}

export default HomePage
