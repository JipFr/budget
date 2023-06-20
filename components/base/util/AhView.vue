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
            <span>{{ account?.info?.length }} receipts</span>
          </p>
        </div>
        <div v-else>
          <p>
            Something went wrong with this account.
            <span>{{ account.error }}</span>
          </p>
        </div>
      </card>
      <payment-card
        v-for="(transaction, i) of transactions"
        :key="`payment-${i}`"
        :payment="transaction"
      />
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

import PaymentCard from '~/components/base/PaymentCard'

import { state as AhState } from '~/krab-plugins/ah/'

export default {
  components: {
    Subtitle,
    AppButton,
    Banner,
    Card,
    PaymentCard,
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
  data() {
    return {
      error: '',
      tokens: [],
      transactions: [],
      AhState,
    }
  },
  computed: {
    loading() {
      return AhState.loading
    },
    accountsInfo() {
      console.log(AhState)
      return AhState.token
        ? [
            {
              error: AhState.error,
              info: AhState.receipts,
              id: AhState.token.id,
            },
          ]
        : []
    },
  },
}
</script>
