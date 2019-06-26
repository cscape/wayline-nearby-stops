# nearby-stops

Simple module that lets you specify a list of coordinates (transit stops) and find the nearest ones based on their distance from a given coordinate (like a user's current GPS location). Radius and distances are specified in kilometers, so make sure to account for this when using miles, feet, and meters.

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
```

The structure of [module.js](module.js) is based on [config.toml](config.toml).

## License

[MIT](LICENSE) © [Cyberscape](https://cyberscape.co/).