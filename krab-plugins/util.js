// Import Supabase
import { plugins } from './'
import SupabaseClient from '~/util/supabase'

export async function fetchTokens(pluginKey) {
  if (!pluginKey) return 'No plugin'
  const tokens = (
    await SupabaseClient.from('plugin_access_tokens')
      .select('*')
      .match({ plugin: pluginKey })
  ).data

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    const plugin = plugins.find((p) => p.id === token.plugin)
    if (plugin && plugin.verifyToken)
      tokens[i] = await plugin.verifyToken(token)
  }

  return tokens
}

export async function removeAccount(
  id,
  confirmationMessage = 'Are you sure you want to disconnect this Albert Heijn account?'
) {
  if (!confirm(confirmationMessage)) return

  const { error } = await SupabaseClient.from('plugin_access_tokens')
    .delete()
    .match({
      id,
    })

  if (error) this.error = error
}

export function removeDeleted(arr, deleted) {
  return arr.filter((t) => wasDeleted(t.data, deleted))
}

export function wasDeleted(transaction, deleted) {
  const pluginTransactionId = transaction.plugin_transaction_id
  const plaidTransactionId = transaction.plaid_transaction_id
  const wasDeleted = deleted.find(
    (deleted) =>
      deleted.plugin_transaction_id === pluginTransactionId ||
      deleted.plaid_transaction_id === plaidTransactionId
  )
  return !wasDeleted
}
