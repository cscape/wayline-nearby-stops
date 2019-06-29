# nearby-stops

Simple module that lets you specify a list of coordinates (transit stops) and find the nearest ones based on their distance from a given coordinate (like a user's current GPS location). Radius and distances are specified in kilometers, so make sure to account for this when using miles, feet, and meters.

Although this repo seems large for a simple module, only `exports.js` is used when installed as a dependency. This package is very light, the other files are used for testing and data samples.

## Install

```bash
npm install cscape/wayline-nearby-stops
```

## Usage

```javascript
const NearbyStops = require('@wayline/nearby-stops')
const center = [25.763610, -80.195280]
const radius = 2 // in kilometers
const stops = [
  { lat: 25.775158, lng: -80.187358 },
  { lat: 25.765914, lng: -80.209081 }
  // Only required properties are lat & lng, all else is optional
]

const nearbyStops = new NearbyStops(center, radius, stops)

console.log(nearbyStops.getNearby())
// => [{ lat: 25.775158, lng: -80.187358, distance: 1.548 }, ...]

nearbyStops.updateCenter([25.751, -80.196])
nearbyStops.updateRadius(10)
nearbyStops.getNearby() // => new list of nearby stops
```

## License

[MIT](LICENSE) © [Cyberscape](https://cyberscape.co/).