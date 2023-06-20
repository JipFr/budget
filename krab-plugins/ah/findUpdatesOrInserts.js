import { pluginsState } from '../'
import getTransactionItemList from '../../util/getList'
import { state as ahState, receiptToDescription } from './'

export function findUpdatesOrInserts() {
  const receipts = ahState.receiptsWithInfo
  const oldestReceiptDate = new Date(
    receipts[receipts.length - 1]?.transactionMoment
  )

  // Find transactions that came AFTER the oldest receipt so we
  // don't search through every single transaction, every single time
  const day = 1e3 * 60 * 60 * 24
  const transactionsInPeriod = pluginsState.transactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date)
      return transactionDate.getTime() > oldestReceiptDate.getTime() - day // Add a day of leeway
    }
  )

  // Map each transaction to a list
  const list = {}
  const listMoneySums = {}
  for (const transaction of transactionsInPeriod) {
    list[transaction.id] = getTransactionItemList(transaction.description)
    listMoneySums[transaction.id] = list[transaction.id].reduce(
      (sum, item) => sum + item.cents,
      0
    )
  }

  // Find transactions to MODIFY, not INSERT
  const modifyTransactions = []
  for (const receipt of receipts) {
    const transactionToUpdate = transactionsInPeriod.find((transaction) => {
      return (
        // Check if it's on the same date
        receipt.transactionMoment.startsWith(transaction.date) &&
        // Check if it's an Albert Heijn trnasaction
        transaction.description.toLowerCase().includes('albert heijn') &&
        // Make sure the plugin hasn't already done this one
        !(transaction.plugins_unleashed || '').includes('ah') &&
        // Only find transactions that don't already have a list.
        !list[transaction.id].find((t) => t.cents !== 0) &&
        // Check if price is the same as that of the transaction or the list
        (receipt.total.amount.amount * 100 === listMoneySums[transaction.id] ||
          receipt.total.amount.amount * 100 === transaction.cents * -1)
      )
    })
    if (transactionToUpdate) {
      const unleashed = (transactionToUpdate.plugins_unleashed || '')
        .split(',')
        .filter(Boolean)
      unleashed.push('ah')

      modifyTransactions.push({
        id: transactionToUpdate.id,
        data: {
          description: receiptToDescription(receipt.receipt),
          plugins_unleashed: unleashed.join(','),
        },
      })
    }
  }

  return {
    transactions: {
      modify: modifyTransactions,
    },
  }
}
