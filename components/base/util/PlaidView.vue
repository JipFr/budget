<template>
  <div>
    <banner v-if="error">{{ error }}</banner>
    <app-button @click="addPlaidAccount" class="secondary">
      Add bank account through Plaid
    </app-button>
    <div class="cards">
      <card v-for="account of accountsInfo" :key="account">
        <h4>Account ID #{{ account.id }}</h4>
        <p>
          <span>Last successful update:</span>
          {{ account.status.transactions.last_successful_update }}
        </p>
        <p>
          <span>Last failed update:</span>
          {{ account.status.transactions.last_failed_update }}
        </p>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cards {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px;

  .card h4 {
    margin-bottom: 20px;
  }

  .card p {
    margin-top: 10px;

    span {
      display: block;
      margin-bottom: 3px;
      color: var(--text-secondary);
    }
  }
}
</style>

<script>
// Import components
import Banner from '~/components/base/Banner'
import Card from '~/components/layout/Card'
import AppButton from '~/components/util/Button'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    AppButton,
    Banner,
    Card,
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

      console.log(itemInfo)

      accountsInfo.push({
        id: token.id,
        ...itemInfo?.info,
      })
    }

    this.accountsInfo = accountsInfo

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
  },
}
</script>
