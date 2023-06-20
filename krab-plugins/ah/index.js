import Vue from 'vue'

import { fetchTokens } from '../util'
import { getReceipts, getReceipt, refreshAhToken } from './fetch'
import { findUpdatesOrInserts } from './findUpdatesOrInserts'

import AhLogo from '~/assets/logos/ah.svg?inline'

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
  displayName: 'Albert Heijn',
  icon: AhLogo,
  async init() {
    const tokens = await fetchTokens(this.id)
    state.token = tokens[0]
  },
  async main() {
    if (!state.token) {
      state.loading = false
      return
    }

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
  async verifyToken(token) {
    const endDate = new Date(
      new Date(token.updated_at || token.created_at).getTime() +
        token.expires_in * 1e3
    )

    const tenMinutes = 1e3 * 60 * 10
    if (Date.now() > endDate.getTime() - tenMinutes) {
      // Refresh token
      const refreshed = await refreshAhToken(token)
      return {
        ...token,
        refreshed,
      }
    }
    return token
  },
}
