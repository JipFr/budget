<template>
  <div>
    <container class="limited-width">
      <!-- Hero -->
      <hero :payments="getPayments" />

      <!-- "From" and "until" picker -->
      <from-until-picker />

      <!-- Payment list -->
      <h2>
        <span>Payments</span>
        <loading-icon v-if="isLoading" />
      </h2>
      <payment-list v-if="!isLoading" :raw-payments="getPayments" />
      <div v-else class="loading-wrapper">
        <loading-icon />
      </div>

      <!-- (Fixed position) new transaction wrapper -->
      <new-transaction-wrapper />
    </container>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 20px;
  }
}
.from-until-picker {
  margin-bottom: 40px;
}
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
}
</style>

<script>
// Import components
import { Capacitor } from '@capacitor/core'
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'
import PaymentList from '~/components/base/PaymentList'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import LoadingIcon from '~/components/base/LoadingIcon'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'

export default {
  components: {
    PaymentList,
    Container,
    Hero,
    FromUntilPicker,
    LoadingIcon,
    NewTransactionWrapper,
  },
  data() {
    return {
      statusTapped: 0,
      platform: Capacitor.platform,
    }
  },
  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
    isLoading() {
      return this.$store.state.user.data.loading
    },
  },
  mounted() {
    window.addEventListener('statusTap', () => {
      this.statusTapped++
    })
  },
}
</script>
