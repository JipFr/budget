// Import other
import getTransactionItemList from '~/util/getList'

function clean(str) {
  return str.trim().toLowerCase()
}

export function getDifferences(allPayments) {
  const now = Date.now()

  // Generate a "list" for every single transaction EVERRRRRRRRRRRRRRRR
  const transactionLists = {}
  for (const transaction of allPayments) {
    transactionLists[transaction.id] = getTransactionItemList(
      transaction.description,
      true,
      true
    )
  }

  // Get all payments from the last 30 days; we only want to compare those.
  const paymentsInLastMonth = allPayments.filter((payment) => {
    const d = new Date(payment.date)
    const diff = now - d.getTime()
    const days = diff / (1e3 * 60 * 60 * 24)
    return days < 30
  })

  const itemTracker = {}

  for (const transaction of paymentsInLastMonth) {
    //
    const list = transactionLists[transaction.id]
    if (list.length > 0) {
      const store = list.find((t) => t.cents === 0).description
      if (!itemTracker[store]) itemTracker[store] = {}

      // Find matching product in older transaction
      const allPossibleTransactions = allPayments
        .filter((payment) => {
          return (
            new Date(payment.date).getTime() <
              new Date(transaction.date).getTime() &&
            transactionLists[payment.id][0]?.description &&
            // Check if it's the same store
            clean(transactionLists[payment.id][0]?.description) === clean(store)
          )
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      for (const product of list) {
        // Resume if a matching product has already been found
        if (
          product.cents <= 0 ||
          (itemTracker[store][product.description] &&
            itemTracker[store][product.description] !== null)
        )
          continue

        // Find product in older transaction
        const olderTransactionWithProduct = allPossibleTransactions.find(
          (payment) => {
            return transactionLists[payment.id].find(
              (t) => clean(t.description) === clean(product.description)
            )
          }
        )

        if (!olderTransactionWithProduct) {
          itemTracker[store][product.description] = null
          continue
        }

        const productInPrevious = transactionLists[
          olderTransactionWithProduct.id
        ].find((t) => clean(t.description) === clean(product.description))

        itemTracker[store][product.description] = {
          currentTransaction: { ...transaction },
          previousTransaction: { ...olderTransactionWithProduct },
          product,
          productInPrevious,
          name: product.description,
        }
      }
    }
  }

  // Now that we have every store of the last 30 days with every item compared against itself,
  // let's find the ones where there's an actual price difference
  let differences = []

  for (const store of Object.keys(itemTracker)) {
    for (const productName of Object.keys(itemTracker[store])) {
      const obj = itemTracker[store][productName]
      if (
        obj &&
        obj.productInPrevious.centsPerEntry !== obj.product.centsPerEntry
      ) {
        differences.push({
          productName,
          store,
          was: obj.productInPrevious.centsPerEntry,
          is: obj.product.centsPerEntry,
          latestDate: obj.currentTransaction.date,
          data: obj,
        })
      }
    }
  }

  differences = differences.sort((a, b) => {
    return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
  })

  return differences
}
