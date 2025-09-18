export function formatDate(dateStr) {
  if (!dateStr) return "N/A"

  const d = new Date(dateStr)
  if (isNaN(d)) return "N/A"

  const now = new Date()
  const options =
    d.getFullYear() === now.getFullYear()
      ? { month: "short", day: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" }

  return d.toLocaleDateString("en-US", options)
}
