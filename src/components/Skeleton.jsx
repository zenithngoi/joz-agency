// Reusable shimmering placeholder blocks for loading states.
// Uses the .skeleton-block shimmer animation defined in index.css so every
// instance shares one <style>/keyframe instead of injecting its own.

export default function Skeleton({ width = '100%', height = 14, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton-block"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

// Convenience helper for stacking several skeleton lines/rows with a gap —
// handy for table bodies, feed lists, and card grids.
export function SkeletonRows({ rows = 3, height = 14, gap = 8, width = '100%', radius = 6 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} width={width} height={height} radius={radius} />
      ))}
    </div>
  )
}
