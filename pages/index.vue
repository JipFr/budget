<template>
  <div>
    <container class="limited-width">
      <!-- Hero -->
      <hero :payments="getPayments" />

      <!-- "From" and "until" picker -->
      <from-until-picker />

      <!-- Navigation -->
      <div>
        <nav>
          <nuxt-link class="link" to="/">Payments</nuxt-link>
          <nuxt-link class="link" to="/?overview">Overview</nuxt-link>
        </nav>
        <loading-icon v-if="isLoading" />
      </div>

      <!-- Wrapper or loading state -->
      <div v-if="!isLoading" class="tab-wrapper">
        <!-- Payment list -->
        <payment-list v-if="getQuery === ''" :raw-payments="getPayments" />
        <category-overview
          v-else-if="getQuery === 'overview'"
          :payments="getPayments"
        />
        <div v-else>Unknown page.</div>
      </div>
      <div v-else class="loading-wrapper">
        <loading-icon />
      </div>

      <!-- (Fixed position) new transaction wrapper -->
      <new-transaction-wrapper :show-button="getQuery === ''" />
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
.tab-wrapper {
  margin-top: 20px;
}
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
}
nav a {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  padding: 8px 20px;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: normal;

  &.nuxt-link-exact-active {
    border-bottom-color: var(--text);
  }
}
</style>

<script>
// Import components
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'
import PaymentList from '~/components/base/PaymentList'
import CategoryOverview from '~/components/base/CategoryOverview'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'

// Import icons
import LoadingIcon from '~/components/base/LoadingIcon'

export default {
  components: {
    PaymentList,
    CategoryOverview,
    Container,
    Hero,
    FromUntilPicker,
    LoadingIcon,
    NewTransactionWrapper,
  },
  computed: {
    getPayments() {
      const user = this.$store.state.user.data
      return user.transactionsInPeriod || []
    },
    isLoading() {
      return this.$store.state.user.data.loading
    },
    getQuery() {
      return Object.keys(this.$route.query).join('')
    },
  },
}
</script>
