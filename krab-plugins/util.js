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
  console.log(JSON.stringify(tokens), 12)

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    const plugin = plugins.find((p) => p.id === token.plugin)
    if (plugin && plugin.verifyToken)
      tokens[i] = await plugin.verifyToken(token)
  }

  return tokens
}
