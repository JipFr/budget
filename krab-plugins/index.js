import Vue from 'vue'
import { modifyTransactions, insertTransactions } from './actions'

import { plugin as ah } from './ah'
import { plugin as plaid } from './plaid'

// Define plugins
export const plugins = [ah, plaid].sort((a, b) => a.priority - b.priority)

// Init plugin state
export const pluginsState = Vue.observable({
  loading: true,
  pluginCount: plugins.length,
  pluginsLoaded: 0,
  transactions: [],
  inited: false,
})

// Main function, called after transactions are set
export async function main() {
  if (pluginsState.inited) return
  pluginsState.inited = true

  for (const plugin of plugins) {
    let data
    try {
      if (plugin.init) await plugin.init()
      data = await plugin.main()
    } catch {
      // TODO error handling
    }

    if (!data) {
      pluginsState.pluginsLoaded++
      continue
    }

    if (data.transactions?.modify)
      await modifyTransactions(data.transactions.modify)
    if (data.transactions?.insert)
      await insertTransactions(data.transactions.insert)
    pluginsState.pluginsLoaded++
  }
  pluginsState.loading = false
}
