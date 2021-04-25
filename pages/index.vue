<template>
  <div>
    <container class="limited-width is-main-wrapper">
      <div class="core-info">
        <div class="info-content">
          <!-- Hero -->
          <hero :payments="getPayments" />

          <!-- "From" and "until" picker -->
          <from-until-picker />
        </div>
      </div>

      <div class="main">
        <!-- Navigation -->
        <div class="nav">
          <nav>
            <nuxt-link class="link" to="/">Payments</nuxt-link>
            <nuxt-link class="link" to="/?overview">Overview</nuxt-link>
            <nuxt-link class="link" to="/?budget">Budget</nuxt-link>
            <nuxt-link class="link" to="/?recurring">Recurring</nuxt-link>
          </nav>
        </div>

        <!-- Wrapper or loading state -->
        <div v-if="!isLoading" class="tab-wrapper">
          <!-- Payment list -->
          <payment-list v-if="getQuery === ''" :raw-payments="getPayments" />
          <category-overview
            v-else-if="getQuery === 'overview'"
            :payments="getPayments"
          />
          <budget-overview
            v-else-if="getQuery === 'budget'"
            :payments="getPayments"
          />
          <recurring
            v-else-if="getQuery === 'recurring'"
            :all-payments="getAllPayments"
          />
          <div v-else>Unknown page.</div>
        </div>
        <div v-else class="loading-wrapper">
          <loading-icon />
        </div>
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
.is-main-wrapper {
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: 'info' 'main';

  .core-info {
    grid-area: info;
  }
  .main {
    grid-area: main;
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

@media (min-width: 800px) {
  .is-main-wrapper {
    max-width: 1300px;
    grid-template-columns: 350px 1fr 350px;
    grid-gap: 40px;
    grid-template-areas: 'info main';
  }
  .info-content {
    position: sticky;
    top: 60px;
  }
  nav {
    display: flex;
    justify-content: center;
  }
}
</style>

<script>
// Import components
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'
import PaymentList from '~/components/base/PaymentList'
import CategoryOverview from '~/components/base/CategoryOverview'
import Recurring from '~/components/base/Recurring'
import BudgetOverview from '~/components/base/BudgetOverview'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import NewTransactionWrapper from '~/components/new-transaction/MainWrapper'

// Import icons
import LoadingIcon from '~/components/base/LoadingIcon'

export default {
  components: {
    PaymentList,
    CategoryOverview,
    BudgetOverview,
    Recurring,
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
    getAllPayments() {
      const user = this.$store.state.user.data
      return user.transactions || []
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
