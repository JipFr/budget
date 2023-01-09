import { clean } from '~/util/getDifferences'
import getTransactionItemList from '~/util/getList'

export const unmeasured = 'unmeasured'

export function getInventory($store) {
  const user = $store.state.user.data
  const transactions = user.transactions || []
  const inventory = user.inventory

  // Get all relevant payments
  const inventoryPayments = transactions.filter(
    (t) => t.categories.includes('stock') || t.categories.includes('inventory')
  )

  // Generate list for every single transaction
  const lists = {}

  for (const payment of inventoryPayments) {
    lists[payment.id] = getTransactionItemList(payment.description, {
      removeEuroString: true,
    })
  }

  const products = {}

  // Add up every single inventory transaction ever
  for (const payment of inventoryPayments) {
    const list = lists[payment.id]
    for (const product of list) {
      if (product.cents <= 0) continue

      const productName = clean(product.description)
      if (!products[productName])
        products[productName] = {
          name: product.description,
          weights: {},
        }

      const measuringUnit = product.weight?.measurement || unmeasured
      if (!products[productName].weights[measuringUnit])
        products[productName].weights[measuringUnit] = {
          count: 0,
        }

      products[productName].weights[measuringUnit].count +=
        product?.weight?.totalValue ?? product.itemCount
    }
  }

  // Remove all counted thingies from the database
  for (const remover of inventory) {
    const productName = clean(remover.name)
    if (products[productName]?.weights[remover.measuringUnit || unmeasured]) {
      products[productName].weights[
        remover.measuringUnit || unmeasured
      ].count -= remover.count
    }
  }

  // Remove all weird decimal things
  for (const product of Object.keys(products)) {
    for (const measurementUnit of Object.keys(products[product].weights)) {
      products[product].weights[measurementUnit].count =
        Math.round(products[product].weights[measurementUnit].count * 100) / 100
    }
  }

  return products
}
