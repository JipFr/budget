import { pluginsState } from '../'
import { loadSettings } from '../../util/settings'
import { state } from './'
import { state as settingsState } from '~/util/settings'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export async function exchangeToken(publicToken) {
  const tokenExchangeRes = await fetch(
    `/.netlify/functions/exchange-public-token?public-token=${publicToken}`
  ).then((d) => d.json())

  const submitObj = {
    user_id: SupabaseClient.auth.user().id,
    access_token: tokenExchangeRes.token,
    plugin: 'plaid',
  }

  // Insert access token
  await SupabaseClient.from('plugin_access_tokens').insert([submitObj])
}

export function addPlaidAccount() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const user = SupabaseClient.auth.user()

    // Request link token
    const linkTokenRes = await fetch(
      `/.netlify/functions/create-link-token?user-id=${user.id}`
    ).then((d) => d.json())

    // Init Plaid Link
    // eslint-disable-next-line no-undef
    const { open } = Plaid.create({
      token: linkTokenRes.token,
      onSuccess: async (publicToken) => {
        await exchangeToken(publicToken)
        resolve()
      },
      onExit: () => {
        resolve()
      },
    })

    open()
  })
}

export async function getPlaidImports() {
  const errors = []
  const allTransactions = []
  const metas = []
  for (const token of state.tokens) {
    const transactionRes = await fetch(
      `/.netlify/functions/get-transactions?access-token=${token.access_token}`
    ).then((d) => d.json())
    if (transactionRes.error) {
      errors.push({
        id: token.id,
        error: transactionRes.error,
      })
      continue
    }
    metas.push({
      id: token.id,
      meta: transactionRes.meta,
    })
    allTransactions.push(...transactionRes.transactions)
  }

  // Generate transactions objects
  await loadSettings()
  const importPendingTransactions = settingsState.importPendingTransactions
  const transactions = []
  for (const transaction of allTransactions.filter(
    (t) => importPendingTransactions === 'yes' || t.pending === false
  )) {
    const name = transaction.merchant_name || transaction.name.split(' ')[0]

    const descriptionArr = [
      name,
      transaction.name.replace(name || Math.random(), ''),
    ]
      .filter(Boolean)
      .map((s) => s.trim())
    const description = [...new Set(descriptionArr)].join('\n') + ' (imported)'
    const lowercaseName = name.toLowerCase()

    let categories = []
    if (
      lowercaseName.includes('albert heijn') ||
      lowercaseName.includes('lidl') ||
      lowercaseName.includes('jumbo')
    ) {
      categories = ['Boodschappen', 'Eten', 'Stock']
    } else {
      categories = [
        ...new Set(
          transaction.category
            .flatMap((category) => {
              const c = category.toLowerCase()

              if (c.includes('food') || c.includes('groceries'))
                return ['Groceries', 'Food']

              return category
            })
            .filter(Boolean)
        ),
      ]
    }

    transactions.push({
      user_id: SupabaseClient.auth.user().id,
      cents: transaction.amount * 100 * -1,
      date: transaction.date,
      plugins_unleashed: 'plaid',
      plaid_transaction_id: `${transaction.amount}-${
        transaction.date
      }-${description
        .replace(/\n/g, '')
        .replace(/\(imported\)/g, '')
        .trim()}`,
      description,
      categories,
    })
  }

  const insert = transactions
    .filter((transaction) => {
      const existing = pluginsState.transactions.find(
        (t) =>
          t.plaid_transaction_id === transaction.plaid_transaction_id ||
          (t.date === transaction.date && t.cents === transaction.cents)
      )
      return !existing
    })
    .map((transaction) => ({ data: transaction }))

  return {
    transactions: { insert },
    errors,
    metas,
  }
}
