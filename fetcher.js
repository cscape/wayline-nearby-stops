/* 1. Fetch all stops
 * 2. Given a [LAT,LONG] within a certain radius (5 km) filter out all stops outside of that
 *    by eliminating all stops above and below the radius (latitude) and all stops left/right
 *    of the radius (longitude). Afterwards, circular geometry will determine if the stop
 *    resides within the radius or is outside the boundary of the circle but not the square.
 * 3. Return all nearby stops, sorted by distance from the center.
 */

const { GetRoutes, GetRouteStops } = require('./lib/tso').PublicTransportation
const companies = [30109, 21241, 22844, 2500, 24600, 26082, 31344, 31934, 24560, 21324, 34323, 49454, 34423]
let routes = []
let stops = []

const fetchAllRoutes = async () => {
  for (let i = 0; i < companies.length; i += 1) {
    const routeData = await GetRoutes(companies[i])
    routes.push(...routeData)
  }
  return routes
}

const fetchAllStops = async routes => {
  for (let i = 0; i < routes.length; i += 1) {
    const stopsdata = await GetRouteStops(null, routes[i].id)
    stops.push(...stopsdata)
  }
  return stops
}

// Used to fetch & save stops

const fs = require('fs')
fetchAllRoutes().then(async routes => {
  console.log(routes)
  const stops = await fetchAllStops(routes)
  fs.writeFileSync('stops.json', JSON.stringify(stops), 'utf8')
})
