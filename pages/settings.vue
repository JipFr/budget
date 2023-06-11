<template>
  <div>
    <page-title>Settings</page-title>
    <button @click="addPlaidAccount">Add Plaid account</button>
    <p v-if="loading">Loading...</p>
    <p v-else style="white-space: pre">
      {{ formattedTransactions }}
    </p>
  </div>
</template>

<script>
import PageTitle from '~/components/title/PageTitle'

// Import Supabase
import SupabaseClient from '~/util/supabase'

async function exchangeToken(publicToken) {
  const tokenExchangeRes = await fetch(
    `/.netlify/functions/exchange-public-token?public-token=${publicToken}`
  ).then((d) => d.json())

  const bankAccounts = JSON.parse(localStorage.getItem('plaid-tokens') || '[]')
  bankAccounts.push(tokenExchangeRes.token)
  localStorage.setItem(
    'plaid-tokens',
    JSON.stringify([...new Set(bankAccounts)])
  )
  location.reload()
}

export default {
  components: {
    PageTitle,
  },
  async fetch() {
    this.loading = true
    for (const token of this.plaidTokens) {
      const transactionRes = await fetch(
        `/.netlify/functions/get-transactions?access-token=${token}`
      ).then((d) => d.json())
      console.log(transactionRes)
      this.transactions.push(...transactionRes.transactions)
    }
    this.loading = false
  },
  data() {
    return {
      plaidTokens: JSON.parse(localStorage.getItem('plaid-tokens') || '[]'),
      transactions: [],
      loading: true,
    }
  },
  computed: {
    formattedTransactions() {
      return JSON.stringify(this.transactions, null, '\t')
    },
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
        onSuccess: async (publicToken, metadata) => {
          await exchangeToken(publicToken)
        },
        onExit: (err, metadata) => {
          console.error(
            `I'm all done. Error: ${JSON.stringify(
              err
            )} Metadata: ${JSON.stringify(metadata)}`
          )
        },
        onEvent: (eventName, metadata) => {
          console.info(`Event ${eventName}`)
        },
      })

      open()
    },
  },
}
</script>
