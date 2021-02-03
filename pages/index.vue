<template>
  <div>
    <container class="limited-width">
      <!-- Hero -->
      <hero :payments="getPayments" />

      <!-- "From" and "until" picker -->
      <from-until-picker />

      <!-- Payment list -->
      <h2>Payments</h2>
      <payment-list v-if="!isLoading" :raw-payments="getPayments" />
    </container>
  </div>
</template>

<style lang="scss" scoped>
.from-until-picker {
  margin-bottom: 40px;
}
</style>

<script>
// Import components
import { Capacitor } from '@capacitor/core'
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'
import PaymentList from '~/components/base/PaymentList'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'

export default {
  components: {
    PaymentList,
    Container,
    Hero,
    FromUntilPicker,
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
