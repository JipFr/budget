// Import Supabase
import SupabaseClient from '~/util/supabase'

export async function modifyTransactions(modify) {
  const errors = []
  const successes = []
  for (const toModify of modify) {
    const data = await SupabaseClient.from('transactions')
      .update(toModify.data)
      .match({
        id: toModify.id,
      })
    if (data.error) {
      errors.push(data.error)
    } else {
      successes.push(data)
    }
  }

  return { errors, successes }
}

export async function insertTransactions(insert) {
  const errors = []
  const successes = []
  for (const toInsert of insert) {
    const data = await SupabaseClient.from('transactions').insert([
      toInsert.data,
    ])

    if (data.error) {
      errors.push(data.error)
    } else {
      successes.push(data)
    }
  }

  return { errors, successes }
}
