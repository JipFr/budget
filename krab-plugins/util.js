// Import Supabase
import { refreshAhToken } from './ah'
import SupabaseClient from '~/util/supabase'

export async function fetchTokens(plugin) {
  if (!plugin) return 'No plugin'
  const tokens = (
    await SupabaseClient.from('plugin_access_tokens')
      .select('*')
      .match({ plugin: 'ah' })
  ).data

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    const endDate = new Date(
      new Date(token.updated_at || token.created_at).getTime() +
        token.expires_in * 1e3
    )
    const tenMinutes = 1e3 * 60 * 10

    if (Date.now() > endDate.getTime() - tenMinutes) {
      // Refresh token
      const refreshed = await refreshAhToken(token)
      tokens[i] = {
        ...tokens[i],
        refreshed,
      }
    }

    console.log(endDate)
  }

  return tokens
}
