<template>
  <div>
    <app-header title="Budget" />
    <div class="page">
      <div v-if="error">
        <container class="limited-width">
          <banner>⚠️ {{ error }}</banner>
        </container>
      </div>
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
                <nuxt-link class="link" to="/categories">Categories</nuxt-link>
                <nuxt-link class="link" to="/recurring">Recurring</nuxt-link>
                <nuxt-link class="link" to="/overview">Overview</nuxt-link>
              </nav>
            </div>

            <!-- Wrapper or loading state -->
            <div v-if="!isLoading" class="tab-wrapper">
              <Nuxt />
            </div>

            <div v-else class="loading-wrapper">
              <loading-icon />
            </div>

            <div v-if="false" class="tab-wrapper">
              <!-- Payment list -->
              <category-overview
                v-if="getQuery === 'categories'"
                :payments="getPayments"
              />
              <recurring
                v-else-if="getQuery === 'recurring'"
                :all-payments="getAllPayments"
              />
              <total-overview
                v-else-if="getQuery === 'overview'"
                :payments="getAllPayments"
              />
              <div v-else>Unknown page.</div>
            </div>
          </div>

          <!-- (Fixed position) new transaction wrapper -->
          <div class="new-transaction-wrapper">
            <portal-target name="right-side"></portal-target>
          </div>
        </container>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
}

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

@media (max-width: 1149px) {
  nav {
    margin-left: -5vw;
    padding-left: 5vw;
    margin-right: -5vw;
    padding-right: 5vw;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;

    &::after {
      content: '';
      display: block;
      min-width: 5vw;
      height: 1px;
    }
  }
}
@media (min-width: 1149px) {
  .is-main-wrapper {
    max-width: 1300px;
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-gap: 40px;
    grid-template-areas: 'info main';
  }
  .info-content,
  .new-transaction-content {
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
import { mapMutations } from 'vuex'
import { PortalTarget } from 'portal-vue'

// Import components
import Hero from '~/components/base/Hero'
import Banner from '~/components/base/Banner'
import AppHeader from '~/components/layout/Header'
import Container from '~/components/layout/Container'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import CategoryOverview from '~/components/base/CategoryOverview'

// Import icons
import LoadingIcon from '~/components/base/LoadingIcon'

export default {
  components: {
    AppHeader,
    Banner,
    Container,
    CategoryOverview,
    Hero,
    FromUntilPicker,
    LoadingIcon,
    PortalTarget,
  },
  async fetch() {
    this.setLoading(true)
    await this.$axios('/user/get')
      .then(({ data }) => {
        const userData = data.data
        this.setPerson(userData)
      })
      .catch((err) => {
        this.error = err
      })
  },
  fetchOnServer: false,
  data() {
    return {
      error: '',
    }
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
  mounted() {
    this.$nuxt.$on('refetch', () => {
      this.$fetch()
    })
  },
  methods: {
    ...mapMutations({
      setPerson: 'user/set',
      setLoading: 'user/setLoading',
    }),
  },
  middleware: 'usercheck',
}
</script>
