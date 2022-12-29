// Functions
function toCents(euroVal) {
  const euroArray = euroVal.replace(/€| |\+/g, '').split('.')
  const isNegative = Number(euroVal.replace(/€/g, '')) < 0
  const eurosInCents = Math.abs(euroArray[0] * 100)
  const cents = euroArray[1]
  const total = (Number(eurosInCents) || 0) + (Number(cents) || 0)
  return isNegative ? -total : total
}

function toNumber(str) {
  return Number(str.replace(/[a-zA-Z]/gi, ''))
}

export function getWeightLabel(unit, value) {
  switch (unit) {
    case 'cl':
      return value >= 100 ? `${value / 100}li` : `${value}cl`
    case 'gr':
      return value >= 1000 ? `${value / 1000}kg` : `${value}gr`
    default:
      return null
  }
}

export default function getTransactionItemList(
  description,
  removeCount = true,
  removeEuroString = false,
  removeMeasurements = true
) {
  const entries = []

  // See if description is grocery-like
  if (description.includes('\n')) {
    const descriptionArray = description.split('\n').map((item) => item.trim())

    // eslint-disable-next-line prefer-const
    for (let [i, entry] of Object.entries(descriptionArray)) {
      // Find weights and sutff
      let weight = null

      // ? Grams
      const gramRegex = /(\d+|\.+)+gr/i
      const kgRegex = /(\d+|\.+)+kg/i

      const gramMatch = entry.match(gramRegex)
      const kgMatch = entry.match(kgRegex)

      if (gramMatch) {
        weight = {
          measurement: 'gr',
          value: toNumber(gramMatch[0]),
        }
      }

      if (kgMatch) {
        weight = {
          measurement: 'gr',
          value: toNumber(kgMatch[0]) * 1e3,
        }
      }

      // ? Liters
      const literRegex = /(\d+|\.+)+l|(\d+|\.+)+ liter/i
      const clRegex = /(\d+|\.+)+cl/i

      const literMatch = entry.match(literRegex)
      const clMatch = entry.match(clRegex)

      if (literMatch) {
        weight = {
          measurement: 'cl',
          value: toNumber(literMatch[0]) * 100,
        }
      }

      if (clMatch) {
        weight = {
          measurement: 'cl',
          value: toNumber(clMatch[0]),
        }
      }

      if (Number.isNaN(weight?.value)) weight = null

      if (weight && removeMeasurements) {
        // Adjust string to remove weight
        entry = entry
          .replace(new RegExp(gramRegex, 'gi'), '')
          .replace(new RegExp(kgRegex, 'gi'), '')
          .replace(new RegExp(literRegex, 'gi'), '')
          .replace(new RegExp(clRegex, 'gi'), '')
          .trim()
      }

      // Add labels to weight
      if (weight)
        weight.label = getWeightLabel(weight.measurement, weight.value)

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
        weight,
      })
    }
  }

  return entries
}
