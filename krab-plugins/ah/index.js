import Vue from 'vue'

import { fetchTokens } from '../util'
import { getReceipts, getReceipt } from './fetch'
import { findUpdatesOrInserts } from './findUpdatesOrInserts'

export * from './receiptToDescription'
export * from './fetch'

export const state = Vue.observable({
  receipts: [],
  receiptsWithInfo: [],
  token: null,
  loading: true,
  error: null,
})

export const plugin = {
  priority: 10,
  id: 'ah',
  async init() {
    const tokens = await fetchTokens(this.id)
    state.token = tokens[0]
  },
  async main() {
    if (!state.token) return
    state.loading = true

    const receiptsRes = await getReceipts(state.token)
    if (receiptsRes.error) {
      state.error = receiptsRes.error
      state.loading = false
      return
    } else {
      state.receipts = receiptsRes
    }

    // Get latest receipts
    const receipts = (state.receipts || []).slice(0, 10)
    const receiptsWithInfo = await Promise.all(
      receipts.map(async (r) => {
        return {
          ...r,
          receipt: await getReceipt(state.token, r.transactionId),
        }
      })
    )
    state.receiptsWithInfo = receiptsWithInfo

    const data = findUpdatesOrInserts()

    state.loading = false
    return data
  },
}
