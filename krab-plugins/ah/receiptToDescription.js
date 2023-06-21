function formatEur(str, between = '') {
  return `€${between}${str.replace(/,/g, '.')}`
}

export function receiptToDescription(receipt) {
  const storeName = receipt
    .find((t) => t.type === 'text')
    .value.replace(/\d+/g, '')

  const description = [storeName]

  // Products
  let productRange = receipt.slice(
    receipt.findIndex((t) => t.type === 'products-header') + 2
  ) // Starting from after the divider
  productRange = productRange.slice(
    0,
    productRange.findIndex((t) => t.type === 'divider')
  )
  productRange = productRange.filter(
    (t) => t.type === 'product' && !t.amount.startsWith('xx')
  )

  for (const product of productRange) {
    const desc = product.description.toLowerCase()
    const eur = formatEur(product.amount)

    if (desc.startsWith('+')) {
      description[description.length - 1] =
        description[description.length - 1] + ` + ${eur}`
    } else {
      const descText = `${
        product.quantity && Number(product.quantity) !== 1
          ? `${product.quantity} ${
              product.quantity.includes('KG') ? '' : 'x'
            }`.trim()
          : ''
      } ${desc} ${eur}`.trim()
      description.push(descText.slice(0, 1).toUpperCase() + descText.slice(1))
    }
  }

  // Add "money removed" (statiegeld, bonus box)

  const bonusLines = receipt.filter((t) => t.quantity === 'BONUS')
  for (const bonusLine of bonusLines) {
    description.push(
      `${bonusLine.description.toLowerCase()} bonus ${formatEur(
        bonusLine.amount
      )}`
    )
  }

  // Statiegeld
  const deposit = receipt.find((t) => t.description === 'EMBALLAGE')
  if (deposit) {
    description.push(`Statiegeld ${formatEur(deposit.amount, '-')}`)
  }

  return description.map((t) => t.trim().replace(/ {2}/g, ' ')).join('\n')
}
