export type Point3D = [number, number, number]

export type SurfaceHit = {
  type: string
  transform: { position: number[] }
}

export type MeasurementTarget = { position: Point3D; timestamp: number }

export const TARGET_MAX_AGE_MS = 350

export function isPoint3D(point: number[]): point is Point3D {
  return point.length === 3 && point.every(Number.isFinite)
}

export function distanceInMetres(a: Point3D, b: Point3D): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

export function formatDistance(metres: number): string {
  return metres < 1 ? `${(metres * 100).toFixed(1)} cm` : `${metres.toFixed(2)} m`
}

// Only bounded, detected planes: no infinite planes, estimated planes or feature points.
export function selectSurfacePoint(hits: SurfaceHit[], camera: Point3D): Point3D | null {
  if (!isPoint3D(camera)) return null
  let nearest: Point3D | null = null
  let nearestDistance = Infinity
  for (const hit of hits) {
    const point = hit.transform.position
    if (hit.type !== "ExistingPlaneUsingExtent" || !isPoint3D(point)) continue
    const distance = distanceInMetres(point, camera)
    if (distance >= 0.1 && distance <= 5 && distance < nearestDistance) {
      nearest = [...point]
      nearestDistance = distance
    }
  }
  return nearest
}

export function canPlaceTarget(
  target: MeasurementTarget | null,
  trackingNormal: boolean,
  now: number,
): target is MeasurementTarget {
  return trackingNormal && target !== null && isPoint3D(target.position) &&
    now >= target.timestamp && now - target.timestamp <= TARGET_MAX_AGE_MS
}
