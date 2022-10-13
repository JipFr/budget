// Functions
function toCents(euroVal) {
  const euroArray = euroVal.replace(/€| |\+/g, '').split('.')
  const isNegative = Number(euroVal.replace(/€/g, '')) < 0
  const eurosInCents = Math.abs(euroArray[0] * 100)
  const cents = euroArray[1]
  const total = (Number(eurosInCents) || 0) + (Number(cents) || 0)
  return isNegative ? -total : total
}

export default function getTransactionItemList(
  description,
  removeCount = false,
  removeEuroString = false
) {
  const entries = []

  // See if description is grocery-like
  if (description.includes('\n')) {
    const descriptionArray = description.split('\n').map((item) => item.trim())

    for (const [i, entry] of Object.entries(descriptionArray)) {
      // Find item count
      const countRegex = /[\d.]+ ?x|x ?[\d.]+[ +]+?/g
      const countMatch = entry.match(countRegex) || []
      const itemCount = (countMatch || [])
        .map((n) => Number(n.replace(/[^\d.?]/g, '')))
        .reduce((a, b) => a * b, 1)

      // Find money totals
      const moneyRegex = /€(-?\d+(?:\.\d+)?) ?\+? ?/
      const euroArray = entry.match(new RegExp(moneyRegex, 'g'))
      const centArray = (euroArray || []).map(toCents)
      const totalCents = centArray.reduce((a, b) => a + b, 0)

      // Get item name without fields we already have
      let newDescription = entry
        .trim()
        .replace(/ +/g, ' ') // Remove double spaces
        .trim()

      if (removeCount) {
        newDescription = newDescription
          .replace(new RegExp(countRegex, 'gi'), '')
          .trim()
      }

      if (removeEuroString) {
        newDescription = newDescription
          .replace(new RegExp(moneyRegex, 'gi'), '')
          .trim()
      }

      // Add to entries
      entries.push({
        description:
          newDescription.slice(0, 1).toUpperCase() + newDescription.slice(1),
        cents: totalCents,
        centsPerEntry: totalCents / itemCount,
        original: entry,
        id: i,
        itemCount,
      })
    }
  }

  return entries
}
