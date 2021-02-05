export function getEntriesData(payments) {
  // Map all payments into an object that shows how much money each category has spent
  const spendings = {}

  for (const payment of payments) {
    // If there are no categories, add 'other' so it gets added to that
    if (payment.categories.length === 0) {
      payment.categories.push('other')
    }

    for (let tag of payment.categories) {
      tag = tag.toLowerCase().trim()
      if (tag === 'exclude') continue

      // Ensure spendings has a field for it
      if (!spendings[tag]) {
        spendings[tag] = {
          gained: 0,
          spent: 0,
        }
      }

      if (payment.cents > 0) {
        spendings[tag].gained += payment.cents
      } else {
        spendings[tag].spent += payment.cents * -1
      }
    }
  }

  // Make an array of the entries
  let entries = Object.entries(spendings)

  // Find largest "spent" field in categories, then compare the rest to it
  for (const entry of entries) {
    // Get percentage of "gained"
    const total = entry[1].gained + entry[1].spent
    entry[1].spentPercentage = (entry[1].gained / total) * 100
    entry[1].total = total

    // Make all fields to be displayed on the progress card
    entry[1].fields = []

    entry[1].fields.push({
      label: 'Gained',
      type: 'money',
      value: entry[1].gained,
    })
    entry[1].fields.push({
      label: 'Spent',
      type: 'money',
      value: entry[1].spent,
    })
    entry[1].fields.push({
      label: 'Ratio',
      type: 'percentage',
      value: Math.round(entry[1].spentPercentage),
    })
    entry[1].fields.push({
      label: 'Total',
      type: 'money',
      value: entry[1].gained - entry[1].spent,
    })
  }

  entries = entries.sort(
    (a, b) => b[1].total - a[1].total // Sort by amount of spending and gained combined; large to small
  )

  return {
    spendings,
    entries,
  }
}
