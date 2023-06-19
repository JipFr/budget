<template>
  <div v-if="(minimal && accountsInfo.length > 0) || !minimal" class="ah-view">
    <subtitle v-if="minimal && accountsInfo.length > 0">
      Albert Heijn
    </subtitle>
    <banner v-if="error">{{ error }}</banner>
    <div
      v-if="
        ((loading || accountsInfo.length > 0) &&
          (!minimal || accountsInfo.length > 0)) ||
        !minimal
      "
      class="cards"
      :class="minimal && 'minimal'"
    >
      <div v-if="loading">Loading...</div>
      <div v-else-if="accountsInfo.length === 0">No connected account.</div>
      <card
        v-for="account of loading ? [] : accountsInfo"
        :key="`account-${account.id}`"
      >
        <div class="spread">
          <h4>Your Albert Heijn account</h4>
          <app-button class="dangerous" @click="() => removeAcount(account.id)">
            Remove account
          </app-button>
        </div>
        <div v-if="!account.error">
          <p>
            <span>{{ account.info }}</span>
          </p>
        </div>
        <div v-else>
          <p>
            Something went wrong with this account.
            <span>{{ account.error }}</span>
          </p>
        </div>
      </card>
    </div>
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

export function ahFetch(path, opts) {
  return fetch(
    `/.netlify/functions/ah-proxy?path=${encodeURIComponent(path)}`,
    {
      ...opts,
      body: JSON.stringify(opts.body),
    }
  ).then((d) => d.json())
}

function formatEur(str, between = '') {
  return `€${between}${str.replace(/,/g, '.')}`
}

function receiptToDescription(receipt) {
  const storeName = receipt
    .find((t) => t.type === 'text')
    .value.replace(/\d+/g, '')

  const description = [storeName]

  // Products
  let productRange = receipt.slice(
    receipt.findIndex((t) => t.type === 'products-header') + 2
  ) // Starting from after the divider
  productRange = productRange.slice(
    0,
    productRange.findIndex((t) => t.type === 'divider')
  )
  productRange = productRange.filter(
    (t) =>
      t.type === 'product' &&
      !t.description.toLowerCase().includes('bonuskaart')
  )

  for (const product of productRange) {
    const desc = product.description.toLowerCase()
    const eur = formatEur(product.amount)

    if (desc.startsWith('+')) {
      description[description.length - 1] =
        description[description.length - 1] + ` + ${eur}`
    } else {
      const descText = `${
        product.quantity && Number(product.quantity) !== 1
          ? product.quantity
          : ''
      } ${desc} ${eur}`.trim()
      description.push(descText)
    }
  }

  // Add "money removed" (statiegeld, bonus box)

  const bonusLines = receipt.filter((t) => t.quantity === 'BONUS')
  for (const bonusLine of bonusLines) {
    description.push(
      `${bonusLine.description.toLowerCase()} bonus ${formatEur(
        bonusLine.amount
      )}`
    )
  }

  // Statiegeld
  const deposit = receipt.find((t) => t.description === 'EMBALLAGE')
  if (deposit) {
    description.push(`Statiegeld ${formatEur(deposit.amount, '-')}`)
  }

  return description.map((t) => t.trim().replace(/ {2}/g, ' ')).join('\n')
}

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
      await SupabaseClient.from('plugin_access_tokens').select('*')
    ).data

    this.tokens = tokens

    // Fetch account info
    const accountsInfo = []
    for (const token of tokens) {
      const itemInfo = await ahFetch('/mobile-services/v1/receipts', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })

      // ! THIS IS TEMPORARY!
      const receipts = itemInfo.slice(0, 10)
      for (const receipt of receipts) {
        const receiptDetails = await ahFetch(
          `/mobile-services/v1/receipts/${receipt.transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
          }
        )
        receiptToDescription(receiptDetails)
      }

      accountsInfo.push({
        id: token.id,
        info: itemInfo,
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
    async removeAcount(id) {
      if (
        !confirm(
          'Are you sure you want to disconnect this Albert Heijn account?'
        )
      )
        return

      const { error } = await SupabaseClient.from('plugin_access_tokens')
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
