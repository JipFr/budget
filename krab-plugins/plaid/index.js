import Vue from 'vue'

import { fetchTokens } from '../util'
import { addPlaidAccount } from './util'

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
  icon: PlaidLogo,
  state,
  async init() {
    state.loading = true

    // Fetch tokens
    state.tokens = await fetchTokens('plaid')
    console.log(state.tokens)

    // Fetch account info
    for (const token of state.tokens) {
      const itemInfo = await fetch(
        `/.netlify/functions/get-info?access-token=${token.access_token}`
      ).then((d) => d.json())

      console.log(itemInfo)

      state.accounts.push({
        id: token.id,
        ...itemInfo?.info,
        error: itemInfo.error,
      })
    }

    this.accountCards = state.accounts.map((account) => {
      return {
        id: account.id,
        title: `Account #${account.id}`,
        html: account.error
          ? `<p>Something went wrong with this account:</p><p><span>${account.error}</span></p>`
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
  main() {
    state.loading = true

    console.log(state.accounts)

    state.loading = false
    return {}
  },
  async addAccount() {
    await addPlaidAccount()

    await this.init()
    await this.main()
  },
}
