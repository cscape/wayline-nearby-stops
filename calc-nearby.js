const fs = require('fs')
// Latitude: Up and down/north-south
// Longitude: Left and right/east-west

const CENTER = [25.763610, -80.195280] // Brickell Station
const RADIUS = 10 // kilometers
const Radius2 = Math.pow(RADIUS, 2)
const stops = JSON.parse(fs.readFileSync('./data/stops.json', 'utf8'))

const circleBoundary = (c = CENTER, r = RADIUS) => {
  const rInDeg = r * (1 / 110.574) // km => LAT degrees
  const x1 = c[1] - rInDeg
  const x2 = c[1] + rInDeg
  const y1 = c[0] + rInDeg
  const y2 = c[0] - rInDeg
  return [x1, y1, x2, y2]
}

const boundary = circleBoundary()

const boundaryFilter = stops.filter(stop =>
  boundary[2] > stop.lng && stop.lng > boundary[0] &&
  boundary[3] < stop.lat && stop.lat < boundary[1]
)

const filterByRadius = boundaryFilter.map(stop => {
  const Xc = CENTER[1]
  const Yc = CENTER[0]
  const Xp = stop.lng
  const Yp = stop.lat

  const d2 = Math.pow(Xp - Xc, 2) + Math.pow(Yp - Yc, 2)
  stop.distance2 = d2
  stop.distance = Math.sqrt(d2) * 110.574
  return stop
}).filter(stop => stop.distance2 < Radius2).map(stop => {
  delete stop.distance2
  return stop
})

const sortByDistance = filterByRadius.sort((a, b) => a.distance - b.distance)

console.log(sortByDistance.map(s => `${(s.distance * 0.621371).toFixed(2)}mi - ${s.name}`).join('\n'))
