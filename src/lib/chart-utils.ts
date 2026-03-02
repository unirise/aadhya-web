/**
 * Shared chart-building utilities for mermaid diagrams.
 */

/** Extract a numeric score from an opaque responseData payload. */
export function extractScore(data: unknown): number {
  if (typeof data === 'number') return data
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (typeof d.newScore === 'number') return d.newScore
    if (typeof d.optionValue === 'number') return d.optionValue
  }
  return 0
}

/**
 * Extract `newScore` from a response object.
 *
 * Checks the top-level field first (API returns it there but it isn't
 * in the TS type), then falls back into `responseData`.
 * Returns `extractScore(responseData)` as a last resort so charts
 * always have *something* to plot when responses exist.
 */
export function extractNewScore(response: unknown): number {
  if (response && typeof response === 'object') {
    const r = response as Record<string, unknown>
    if (typeof r.newScore === 'number') return r.newScore
    // fallback: look inside responseData
    if (r.responseData && typeof r.responseData === 'object') {
      const rd = r.responseData as Record<string, unknown>
      if (typeof rd.newScore === 'number') return rd.newScore
    }
    // last resort: derive from responseData
    return extractScore(r.responseData)
  }
  return 0
}

/**
 * Build a radar-beta diagram string.
 *
 * @param title  Chart title
 * @param scores `{ displayName: numericScore }` map
 */
export function buildRadarDiagram(
  title: string,
  scores: Record<string, number>
): string | null {
  const entries = Object.entries(scores)
  if (entries.length === 0) return null
  const axes = entries.map(([k], i) => `a${i}["${k}"]`).join(', ')
  const values = entries.map(([, v]) => v).join(', ')
  return `radar-beta
  title ${title}
  axis ${axes}
  curve Scores{${values}}`
}

export interface ScorePoint {
  label: string
  score: number
}

/**
 * Build an xychart-beta line chart showing score progression.
 *
 * Designed for the last N activity responses, plotting `newScore`
 * after each response as a line graph.
 *
 * @param title  Chart title
 * @param points Array of `{ label, score }` (chronological order)
 */
/**
 * Build an xychart-beta line chart showing score progression.
 *
 * The line starts at the baseline (default 50) and tracks through
 * each data point to the last score.
 *
 * @param title    Chart title
 * @param points   Array of `{ label, score }` (chronological order)
 * @param baseline Starting score value (default 50)
 */
export function buildScoreLineChart(
  title: string,
  points: ScorePoint[],
  baseline = 50
): string | null {
  if (points.length === 0) return null
  // Prepend baseline so the line starts at 50
  let all: ScorePoint[] = []
  if (points.length < 10) {
    all = [{ label: 'Start', score: baseline }, ...points]
  } else {
    all = points
  }

  const labels = all.map(p => `"${p.label}"`).join(', ')
  const values = all.map(p => p.score).join(', ')
  const max = Math.ceil(Math.max(...all.map(p => p.score), 100) / 10) * 10

  return `xychart-beta
  title "${title}"
  x-axis [${labels}]
  y-axis "Score" 0 --> ${max}
  bar [${values}]
  line [${values}]`
}
