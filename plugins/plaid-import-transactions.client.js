import Vue from 'vue'
import eventBus from './event-bus'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export const plaidState = Vue.observable({
  loading: true,
})

export default function ({ store }) {
  const t = async () => {
    plaidState.loading = true

    const tokens = JSON.parse(localStorage.getItem('plaid-tokens') || '[]')

    const allTransactions = []

    for (const token of tokens) {
      const transactionRes = await fetch(
        `/.netlify/functions/get-transactions?access-token=${token}`
      ).then((d) => d.json())
      allTransactions.push(...transactionRes.transactions)
    }

    for (const transaction of allTransactions) {
      // SUPABASE STUFF TIME!

      const name = transaction.merchant_name || transaction.name.split(' ')[0]

      const descriptionArr = [
        name,
        transaction.name.replace(name || Math.random(), ''),
      ]
        .filter(Boolean)
        .map((s) => s.trim())
      const description = [...new Set(descriptionArr)].join('\n')

      const categories = [
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

      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        cents: transaction.amount * 100,
        date: transaction.date,
        plaid_transaction_id: transaction.transaction_id,
        description,
        categories,
      }

      const supabaseRes = await SupabaseClient.from('transactions')
        .select('*')
        .eq('plaid_transaction_id', submitObj.plaid_transaction_id)
      const existingTransaction = supabaseRes.data[0]

      if (existingTransaction) continue

      const { error } = await SupabaseClient.from('transactions').insert([
        submitObj,
      ])

      if (error) alert(error.message)

      eventBus.$emit('force-refetch')
    }

    plaidState.loading = false
  }
  t()
}
