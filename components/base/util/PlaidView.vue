<template>
  <div class="plaid-view">
    <subtitle v-if="minimal && accountsInfo.length > 0">Bank accounts</subtitle>
    <banner v-if="error">{{ error }}</banner>
    <p v-if="!minimal" class="secondary">
      Please note that syncing your account will mean your access token will be
      stored in Krab Bij Kas' database.
    </p>
    <div
      v-if="
        (loading || accountsInfo.length > 0) &&
        (!minimal || accountsInfo.length > 0)
      "
      class="cards"
      :class="minimal && 'minimal'"
    >
      <div v-if="loading">Loading...</div>
      <card
        v-for="account of loading ? [] : accountsInfo"
        :key="`account-${account.id}`"
      >
        <div class="spread">
          <h4>Account ID #{{ account.id }}</h4>
          <app-button class="dangerous" @click="() => removeAcount(account.id)">
            Remove account
          </app-button>
        </div>
        <div v-if="!account.error">
          <p>
            <span>Last successful update:</span>
            {{ account.status?.transactions?.last_successful_update }}
          </p>
          <p>
            <span>Last failed update:</span>
            {{ account.status?.transactions?.last_failed_update }}
          </p>
        </div>
        <div v-else>
          <p>
            Something went wrong with this account.
            <span>{{ account.error.error_message }}</span>
          </p>
        </div>
      </card>
    </div>
    <app-button v-if="!minimal" class="secondary" @click="addPlaidAccount">
      Add bank account through Plaid
    </app-button>
  </div>
</template>

<style lang="scss" scoped>
.secondary {
  color: var(--text-secondary);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 10px;

  &:not(.minimal) {
    margin: 40px 0;
  }

  .spread {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .card p {
    margin-top: 10px;

    span {
      display: block;
      margin-bottom: 3px;
      color: var(--text-secondary);
    }
  }

  .card button {
    font-size: 0.9rem;
    text-transform: initial;
    background: transparent;
    color: var(--negative);
    padding: 0;
    border: 0;
  }
}
</style>

<script>
// Import components
import Subtitle from '~/components/title/Subtitle'
import Banner from '~/components/base/Banner'
import Card from '~/components/layout/Card'
import AppButton from '~/components/util/Button'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    Subtitle,
    AppButton,
    Banner,
    Card,
  },
  props: {
    minimal: {
      type: Boolean,
      default: false,
    },
    onlyErrors: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    this.loading = true

    // Fetch tokens
    const tokens = (
      await SupabaseClient.from('plaid_access_tokens').select('*')
    ).data.map((t) => t)

    this.tokens = tokens

    // Fetch account info
    const accountsInfo = []
    for (const token of tokens) {
      const itemInfo = await fetch(
        `/.netlify/functions/get-info?access-token=${token.access_token}`
      ).then((d) => d.json())

      accountsInfo.push({
        id: token.id,
        ...itemInfo?.info,
        error: itemInfo.error,
      })
    }

    this.accountsInfo = this.onlyErrors
      ? accountsInfo.filter((info) => info.error)
      : accountsInfo

    this.loading = false
  },
  data() {
    return {
      loading: true,
      error: '',
      tokens: [],
      accountsInfo: [],
    }
  },
  methods: {
    async addPlaidAccount() {
      const user = SupabaseClient.auth.user()

      // Request link token
      const linkTokenRes = await fetch(
        `/.netlify/functions/create-link-token?user-id=${user.id}`
      ).then((d) => d.json())

      // Init Plaid Link
      // eslint-disable-next-line no-undef
      const { open } = Plaid.create({
        token: linkTokenRes.token,
        onSuccess: async (publicToken) => {
          await this.exchangeToken(publicToken)
        },
        onExit: (err, metadata) => {
          this.error = err
        },
      })

      open()
    },
    async exchangeToken(publicToken) {
      const tokenExchangeRes = await fetch(
        `/.netlify/functions/exchange-public-token?public-token=${publicToken}`
      ).then((d) => d.json())

      const submitObj = {
        user_id: SupabaseClient.auth.user().id,
        access_token: tokenExchangeRes.token,
      }

      // Insert access token
      await SupabaseClient.from('plaid_access_tokens').insert([submitObj])

      location.reload()
    },
    async removeAcount(id) {
      if (
        !confirm(
          'Are you sure you want to delete this bank account from your Krab Bij Kas account?'
        )
      )
        return

      const { error } = await SupabaseClient.from('plaid_access_tokens')
        .delete()
        .match({
          id,
        })

      if (error) this.error = error

      this.$fetch()
    },
  },
}
</script>
