import Vue from 'vue'
import { modifyTransactions } from './actions'

import { plugin as ah } from './ah'

// Define plugins
export const plugins = [ah].sort((a, b) => a.priority - b.priority)

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
  console.log('Starting plugins')
  if (pluginsState.inited) return

  for (const plugin of plugins) {
    if (plugin.init) await plugin.init()
    const data = await plugin.main()

    if (!data) {
      pluginsState.pluginsLoaded++
      continue
    }

    if (data.transactions?.modify)
      await modifyTransactions(data.transactions.modify)
  }
  pluginsState.loading = false
}
