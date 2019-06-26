const CircleBoundary = (c, r) => {
  const rInDeg = r * (1 / 110.574) // km => LAT degrees
  const x1 = c[1] - rInDeg
  const x2 = c[1] + rInDeg
  const y1 = c[0] + rInDeg
  const y2 = c[0] - rInDeg
  return [x1, y1, x2, y2]
}

/**
 * Load in a bunch of stops, and fetch only the ones nearby.
 */
class NearbyStops {
  /**
   * @param {Array<number>} center An array [latitude, longitude] of a selected location
   * @param {number} radius Radial distance in kilometers
   * @param {[{lat: number, lng: number}]} stops An array of stops with at least a lat and lng property
   */
  constructor (center, radius, stops) {
    this.center = center // Brickell Station
    this.radius = radius // kilometers
    this.stops = stops
    this.boundary = CircleBoundary(center, radius)
    this.nearby = null
  }

  set radius (r) {
    // Only reset if the new radius is bigger than current
    if (this.radius < r) this.nearby = null
    this.radius = r
  }

  set center (c) {
    this.center = c
    this.nearby = null
  }

  /**
   * Returns a list of all nearby stops based on supplied stop data and radius
   */
  getStops () {
    if (this.nearby != null) return this.nearby
    return this.stopsByDistanceAscending(
      this.radialStops(
        this.boundedStops(
          this.stops, this.boundary
        ), this.radius, this.center
      )
    )
  }

  static boundedStops (stops, boundary) {
    return stops.filter(stop =>
      boundary[2] > stop.lng && stop.lng > boundary[0] &&
      boundary[3] < stop.lat && stop.lat < boundary[1]
    )
  }

  // Should be called after filtering by boundary (a square)
  // since radial calculations are more intensive
  static radialStops (stops, radius, center) {
    const radius2 = Math.pow(radius, 2)
    const results = stops.map(stop => {
      const Xc = center[1]
      const Yc = center[0]
      const Xp = stop.lng
      const Yp = stop.lat

      const d2 = Math.pow(Xp - Xc, 2) + Math.pow(Yp - Yc, 2)
      stop.distance2 = d2
      stop.distance = Math.sqrt(d2) * 110.574
      return stop
    }).filter(stop => stop.distance2 < radius2).map(stop => {
      delete stop.distance2
      return stop
    })
    return results
  }

  static stopsByDistanceAscending (stops) {
    return stops.sort((a, b) => a.distance - b.distance)
  }
}
