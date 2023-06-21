import Vue from 'vue'

import { fetchTokens, removeAccount } from '../util'
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
  description: 'automatic receipt imports',
  icon: AhLogo,
  accountLimit: 1,
  accountCards: [],
  state,
  async init() {
    this.accountCards = []
    const tokens = await fetchTokens(this.id)
    state.token = tokens[0]
  },
  async main() {
    if (!state.token) {
      this.accountCards = []
      state.loading = false
      return
    }

    this.accountCards = []
    state.loading = true

    const receiptsRes = await getReceipts(state.token)
    console.log(receiptsRes)
    if (receiptsRes.error) {
      state.error = receiptsRes.error
      state.loading = false
      this.accountCards = [
        {
          id: state.token.id,
          title: 'Your Albert Heijn account',
          html: `<p>Something went wrong with this account:</p><p><span>${receiptsRes.error}</span></p>`,
        },
      ]
      return
    }

    state.receipts = receiptsRes

    // Set account cards for plugin manager
    this.accountCards = [
      {
        id: state.token.id,
        title: 'Your Albert Heijn account',
        html: `<span>${state.receipts.length} receipts</span>`,
      },
    ]

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
  addAccount() {
    location.href = '/plugins/ah'
  },
  async removeAccount(id) {
    await removeAccount(id)

    state.loading = true

    await this.init()
    await this.main()
  },
}
