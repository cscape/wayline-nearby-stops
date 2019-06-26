const fs = require('fs')
const NearbyStops = require('./exports')

const CENTER = [25.763610, -80.195280] // Brickell Station
const RADIUS = 10 // kilometers
const stops = JSON.parse(fs.readFileSync('./data/stops.json', 'utf8'))

const nearbyStops = new NearbyStops(CENTER, RADIUS, stops)

console.log(nearbyStops.getNearby())
