import Vue from 'vue'

import { fetchTokens, removeAccount } from '../util'
import { refreshOvPayToken, getAccounts, getName } from './fetch'
import { findUpdatesOrInserts } from './findUpdatesOrInserts'

import OvPayLogo from '~/assets/logos/ovpay.svg?inline'

export * from './fetch'

export const state = Vue.observable({
  tokens: [],
  loading: true,
  error: null,
})

export const plugin = {
  priority: 15,
  id: 'ovpay',
  displayName: 'OVPay',
  description: 'Automatic OVPay trip imports',
  icon: OvPayLogo,
  accountLimit: Infinity,
  accountCards: [],
  state,
  async init() {
    this.accountCards = []
    const tokens = await fetchTokens(this.id)
    state.tokens = tokens
  },
  async main(deleted) {
    if (!state.tokens) {
      this.accountCards = []
      state.loading = false
      return
    }

    state.loading = true
    this.accountCards = []

    // Set account cards for plugin manager
    for (const token of state.tokens) {
      const authentication = `Bearer ${token.access_token}`
      try {
        const nameData = await getName(authentication)
        const accountsUnderToken = await getAccounts(authentication)
        this.accountCards = [
          ...this.accountCards,
          {
            id: token.id,
            title: nameData.email,
            html: `
            <p>Connected to OVPay account</p>
            <p style="margin-bottom:0.5rem;"><span>${
              accountsUnderToken.length
            } accounts connected</span></p>
            ${accountsUnderToken.map((acc) => {
              return `<div style="display: flex; gap: 0.5rem; align-items: center;">
                <div style="border-radius: 100%; width: 0.5rem; height: 0.5rem; background-color: ${acc.personalization.color.toLowerCase()}"></div>
                <p><span>${acc.personalization.name}</span></p>
              </div>`
            })}`,
          },
        ]
      } catch (err) {
        state.error = true
        state.loading = false
        this.accountCards = [
          ...this.accountCards,
          {
            id: token.id,
            title: 'Your OVPay account',
            error: true,
            html: `
            <p>Something went wrong with this account:</p>
            <p><span>${err}</span></p>
            <p class="mt">
              <span>It's possible your token failed to refresh. If this keeps happening, please remove and re-add your account.</span>
            </p>`,
          },
        ]
      }
    }
    console.log(123)
    // Fetch transactions
    const data = await findUpdatesOrInserts()
    console.log(456)
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
      const refreshed = await refreshOvPayToken(token)
      return {
        ...token,
        ...refreshed,
      }
    }
    return token
  },
  addAccount() {
    location.href = '/plugins/ovpay'
  },
  async removeAccount(id) {
    await removeAccount(id)

    state.loading = true

    await this.init()
    await this.main()
  },
}
