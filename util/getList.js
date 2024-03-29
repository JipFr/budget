import { currencies } from '~/util/settings'

const cache = {}

export const moneyRegex = new RegExp(
  `${currencies}(-?\\d+(?:[\\.|,]\\d+)?) ?\\+? ?`
)

// Functions
function toCents(euroVal) {
  const euroArray = euroVal
    .replace(new RegExp(`${currencies}| |\\+`, 'g'), '')
    .split(/\.|,/)

  const isNegative =
    Number(euroVal.replace(new RegExp(currencies, 'g'), '')) < 0

  const eurosInCents = Math.abs(euroArray[0] * 100)
  const cents = euroArray[1]
  const total = (Number(eurosInCents) || 0) + (Number(cents) || 0)

  return isNegative ? -total : total
}

function toNumber(str) {
  return Number(str.replace(/[a-zA-Z]/gi, ''))
}

export function getWeightLabel(unit, value, doX = true) {
  value = Math.round(value * 100) / 100
  switch (unit) {
    case 'cl':
      return value >= 100 ? `${value / 100}li` : `${value}cl`
    case 'gr':
      return value >= 1000 ? `${value / 1000}kg` : `${value}gr`
    case 'x':
      return doX ? `${value} st` : value.toString()
    case 'unmeasured':
      return doX ? `x ${value}` : value.toString()
    default:
      return null
  }
}

export default function getTransactionItemList(
  description,
  opts,
  payment = { cents: 0 }
) {
  // Check if this was run before
  const cacheKey = `${description}-${JSON.stringify(opts)}-${payment.cents}-${
    payment.id
  }}`
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }

  // Proceed without cache
  const entries = []

  const { removeCount, removeEuroString, removeMeasurements, forceList } = {
    removeCount: true,
    removeEuroString: false,
    removeMeasurements: true,
    forceList: false,
    ...opts,
  }

  // See if description is grocery-like
  if (description.includes('\n') || forceList) {
    const descriptionArray = description
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    // eslint-disable-next-line prefer-const
    for (let [i, entry] of Object.entries(descriptionArray)) {
      const original = entry
      // Find weights and sutff
      let weight = null

      const isAny = entry.startsWith('* ')
      if (isAny) {
        entry = entry.slice(2)
      }
      // ? Grams
      const gramRegex = /[(\d+|.+)]+gr/i
      const kgRegex = /[(\d+|.+)]+kg/i

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
      const literRegex = /[(\d+|.+)]+li?|[(\d+|.+)]+ litr?er?/i
      const clRegex = /[(\d+|.+)]+cl/i
      const mlRegex = /[(\d+|.+)]+ml/i

      const literMatch = entry.match(literRegex)
      const clMatch = entry.match(clRegex)
      const mlMatch = entry.match(mlRegex)

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

      if (mlMatch) {
        weight = {
          measurement: 'cl',
          value: toNumber(mlMatch[0]) / 10,
        }
      }

      // ? Others

      const stRegex = /[(\d+|.+)]+st/i

      const stMatch = entry.match(stRegex)

      if (stMatch) {
        weight = {
          measurement: 'x', // "x" for "times"
          value: toNumber(stMatch[0]),
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
          .replace(new RegExp(mlRegex, 'gi'), '')
          .replace(new RegExp(stMatch, 'gi'), '')
          .trim()
      }

      // Find item count
      const countRegex = /[\d.]+ ?x|x ?[\d.]+[ +]+?/g
      const countMatch = entry.match(countRegex) || []
      const itemCount = (countMatch || [])
        .map((n) => Number(n.replace(/[^\d.?]/g, '')))
        .reduce((a, b) => a * b, 1)

      if (weight) {
        // Add labels to weight
        weight.label = getWeightLabel(weight.measurement, weight.value)

        // Add "true count" to weight
        weight.totalValue = weight.value * itemCount
      }

      // Find money totals
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

      let finalDescription =
        newDescription.slice(0, 1).toUpperCase() + newDescription.slice(1)
      if (finalDescription.toLowerCase().startsWith('ij'))
        finalDescription =
          finalDescription.slice(0, 2).toUpperCase() + finalDescription.slice(2)

      // Add to entries
      entries.push({
        description: finalDescription,
        cents: totalCents,
        centsPerEntry: totalCents / itemCount,
        original,
        id: i,
        itemCount,
        weight,
        isAny,
      })
    }

    // When it's a list with only 1 item, add the $$$ value to the one item
    if (
      entries.length === 2 &&
      !entries.find((p) => p.cents !== 0) &&
      payment &&
      payment.cents !== 0 &&
      !entries.find((p) => p.description.includes('(imported)'))
    ) {
      entries[1].cents = -payment.cents
      entries[1].centsPerEntry = entries[1].cents / entries[1].itemCount
      entries[1].automaticallyFilledInCents = true
    }
  }

  cache[cacheKey] = entries
  return entries
}
