<template>
  <login-wrapper>
    <app-header title="BudgetDuck" />
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
                <nuxt-link
                  class="link"
                  to="/"
                  :class="
                    !path.startsWith('/about') ? 'nuxt-link-exact-active' : ''
                  "
                >
                  Finances
                </nuxt-link>
                <nuxt-link
                  class="link"
                  to="/about"
                  :class="
                    path.startsWith('/about') ? 'nuxt-link-exact-active' : ''
                  "
                >
                  About
                </nuxt-link>
              </nav>
              <nav v-if="financePaths.includes(path)" class="with-badges">
                <nuxt-link class="badge" to="/">Payments</nuxt-link>
                <nuxt-link class="badge" to="/categories">Categories</nuxt-link>
                <nuxt-link class="badge" to="/recurring">Recurring</nuxt-link>
                <nuxt-link class="badge" to="/overview">Overview</nuxt-link>
                <nuxt-link class="badge" to="/prices">Prices</nuxt-link>
              </nav>

              <nav v-if="path.startsWith('/about')" class="with-badges">
                <nuxt-link class="badge" to="/about/"> Profile </nuxt-link>
                <nuxt-link class="badge" to="/about/faq"> FAQ </nuxt-link>
              </nav>
            </div>

            <!-- Wrapper or loading state -->
            <div v-if="!isLoading" class="tab-wrapper">
              <Nuxt />
            </div>

            <div v-else class="loading-wrapper">
              <loading-icon />
            </div>
          </div>

          <!-- (Fixed position) new transaction wrapper -->
          <div class="new-transaction-wrapper">
            <portal-target name="right-side"></portal-target>
          </div>
        </container>
      </div>
    </div>
  </login-wrapper>
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
  grid-template-areas: 'info' 'main' 'right';

  .core-info {
    grid-area: info;
  }
  .main {
    grid-area: main;
  }
  > *:nth-child(3) {
    grid-area: right;
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

nav {
  margin-left: -5vw;
  padding-left: 5vw;
  margin-right: -5vw;
  padding-right: 5vw;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  word-break: normal;

  &::after {
    content: '';
    display: block;
    min-width: 5vw;
    height: 1px;
  }

  &.with-badges {
    margin-left: calc(-5vw - 3px);
  }

  & + nav {
    margin-top: 10px;
  }
}

nav .link {
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

nav .badge {
  padding: 8px 15px;
  background: var(--content);
  color: var(--text);
  text-decoration: none;
  border-radius: 6px;
  margin: 3px;

  &:hover {
    background: var(--alt-content);
  }

  &.nuxt-link-exact-active {
    background: var(--theme);
    color: white;
  }
}

@media (prefers-color-scheme: dark) {
  nav .badge.nuxt-link-exact-active {
    background: var(--alt-content);
  }
}

@media screen and (min-width: 950px) {
  nav {
    // Wrap on desktop to stop annoying layout issues
    flex-wrap: wrap;
  }
  nav::after {
    display: none;
  }
}

@media (min-width: 950px) and (max-width: 1349px) {
  .is-main-wrapper {
    grid-template-columns: 1fr 1.5fr;
    grid-gap: 40px;
    grid-template-areas: 'info main' 'info right';
  }
}

@media (min-width: 1350px) {
  .is-main-wrapper {
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-gap: 40px;
    grid-template-areas: 'info main right';
  }
  .info-content,
  .new-transaction-content {
    position: sticky;
    top: 60px;
  }
  .new-transaction-wrapper > div {
    height: 100%;
  }
}
</style>

<style lang="scss">
@media (min-width: 1350px) {
  .new-transaction-content {
    position: sticky !important;
    top: 60px;
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
import LoginWrapper from '~/components/LoginWrapper'

// Import icons
import LoadingIcon from '~/components/base/LoadingIcon'

// Import Supabase
import SupabaseClient from '~/util/supabase'

export default {
  components: {
    AppHeader,
    Banner,
    Container,
    Hero,
    FromUntilPicker,
    LoadingIcon,
    LoginWrapper,
    PortalTarget,
  },
  async fetch() {
    if (!this.hasFetched) {
      const day = 1e3 * 60 * 60 * 24
      const d = new Date()

      // Find last month's "23rd" and this month's "23rd"
      // We're treating the 23rd as the start of the month — that's when I get paid.
      const currentMonth23rd = new Date(d)
      currentMonth23rd.setDate(23)
      currentMonth23rd.setHours(3)
      currentMonth23rd.setMinutes(0)

      const lastMonth23rd = new Date(
        new Date(d.getFullYear(), d.getMonth()).getTime() - day * 0.75 // This is a bit whack, but TIMEZONES!
      )
      lastMonth23rd.setDate(23)

      const fromDate =
        Date.now() > currentMonth23rd.getTime()
          ? currentMonth23rd
          : lastMonth23rd

      this.setUntil(new Date().toISOString().split('T')[0])
      this.setFrom(fromDate.toISOString().split('T')[0])
    }

    this.setLoading(true)

    const data = await SupabaseClient.from('transactions').select()

    if (data.errors) {
      this.error = data.errors.join('\n')
    }

    this.setPerson({
      transactions: data.data,
    })

    this.hasFetched = true

    this.setLoading(false)
  },
  fetchOnServer: false,
  data() {
    return {
      error: '',
      financePaths: ['/', '/categories', '/recurring', '/overview', '/prices'],
      hasFetched: false,
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
    path() {
      return this.$route.path
    },
  },
  mounted() {
    this.$nuxt.$on('refetch-really', () => {
      this.$fetch()
    })

    SupabaseClient.from('transactions')
      .on('*', (payload) => {
        const user = this.$store.state.user.data
        let transactions = Object.assign([], user.transactions) || []
        switch (payload.eventType) {
          case 'INSERT': {
            transactions.push(payload.new)
            break
          }
          case 'UPDATE': {
            for (let i = 0; i < transactions.length; i++) {
              if (transactions[i].id === payload.new.id) {
                // This is dumb.
                transactions[i] = payload.new
                break
              }
            }
            break
          }
          case 'DELETE': {
            transactions = transactions.filter((t) => t.id !== payload.old.id)
            break
          }
        }
        this.setPerson({
          transactions,
        })
        document.querySelectorAll('.card').forEach((card) => {
          card.scrollTo(0, 0)
        })
      })
      .subscribe()
  },
  methods: {
    ...mapMutations({
      setPerson: 'user/set',
      setLoading: 'user/setLoading',
      setUntil: 'user/setUntil',
      setFrom: 'user/setFrom',
    }),
  },
}
</script>
