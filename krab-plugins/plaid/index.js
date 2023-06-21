import Vue from 'vue'

import { fetchTokens, removeAccount } from '../util'
import { addPlaidAccount, getPlaidImports } from './util'

import PlaidLogo from '~/assets/logos/plaid.svg?inline'

export const state = Vue.observable({
  loading: true,
  tokens: [],
  accounts: [],
})

export const plugin = {
  priority: 1, // Position in queueu
  id: 'plaid',
  displayName: 'Plaid',
  description: 'automatic bank imports',
  icon: PlaidLogo,
  accountCards: [],
  state,
  async init() {
    state.loading = true
    state.accounts = []

    // Fetch tokens
    state.tokens = await fetchTokens('plaid')

    // Fetch account info
    for (const token of state.tokens) {
      try {
        const res = await fetch(
          `/.netlify/functions/get-info?access-token=${token.access_token}`
        )
        if (!res.ok) throw new Error(await res.text())
        const itemInfo = await res.json()

        state.accounts.push({
          id: token.id,
          ...itemInfo?.info,
          error: itemInfo.error,
        })
      } catch (err) {
        state.accounts.push({
          id: token.id,
          error: err.toString().split('\n')[0],
        })
      }
    }

    this.accountCards = state.accounts.map((account) => {
      return {
        id: account.id,
        title: `Account #${account.id}`,
        error: !!account.error,
        html: account.error
          ? `<p>Something went wrong with this account:</p><p><span>${account.error.error_message}</span></p>`
          : `<div>
                <p><span>Last successful update:</span></p>
                <p>${account.status?.transactions?.last_successful_update}</p>
              </div>
              <div class="mt">
                <p><span>Last failed update:</span></p>
                <p>${account.status?.transactions?.last_failed_update}</p>
              </div>`,
      }
    })

    state.loading = false
  },
  async main() {
    state.loading = true

    if (this.accountCards.find((account) => !account.error)) {
      state.loading = false
      return
    }

    const data = await getPlaidImports()

    state.loading = false
    return data
  },
  async addAccount() {
    await addPlaidAccount()

    await this.init()
    await this.main()
  },
  async removeAccount(id) {
    await removeAccount(
      id,
      'Are you sure you want to remove this bank connection?'
    )

    await this.init()
    await this.main()
  },
}
