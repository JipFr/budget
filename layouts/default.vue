<template>
  <login-wrapper>
    <div class="page">
      <app-header @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <div v-if="error">
        <container class="limited-width">
          <banner>⚠️ {{ error }}</banner>
        </container>
      </div>
      <div class="main">
        <div
          class="sidebar-background"
          :open="sidebarOpen"
          @click="sidebarOpen = false"
        />
        <sidebar :open="sidebarOpen">
          <hero :payments="getPayments" />
          <div class="from-until">
            <hr />
            <from-until-picker class="padded padded-right" />
          </div>
        </sidebar>

        <div class="main-content">
          <container class="limited-width">
            <div class="main-content-layout">
              <div v-if="!isLoading" class="tab-wrapper">
                <Nuxt />
              </div>
              <div class="new-transaction-wrapper">
                <portal-target name="right-side" />
              </div>
            </div>
          </container>
        </div>
      </div>
    </div>
  </login-wrapper>
</template>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: 300px 1fr;
}
.main-content-layout {
  padding-top: 50px;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}

hr {
  border: 0;
  width: 100%;
  height: 1px;
  background: var(--border);
}

.sidebar-background {
  display: none;
}

@media (min-width: 1200px) {
  .main-content-layout {
    display: grid;
    grid-template-columns: 1fr 316px;
    grid-gap: 50px;
  }
  .vue-portal-target {
    height: 100%;
  }
}

@media (max-width: 700px) {
  .main-content {
    border-top: 0;
  }
  .main-content-layout {
    padding-top: 30px;
  }
  .main {
    grid-template-columns: 100%;
  }
  .sidebar-background[open] {
    display: block;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 75;
    top: 0;
    left: 0;
  }
}
</style>

<style lang="scss">
[no-right] {
  .main-content-layout {
    grid-template-columns: 100%;
  }
}

@media (min-width: 1200px) {
  .new-transaction-content {
    position: sticky !important;
    top: 55px;

    .content {
      padding: 0 !important;
    }
  }
}
</style>

<script>
import { mapMutations } from 'vuex'
import { PortalTarget } from 'portal-vue'

import eventBus from '../plugins/event-bus'
import { getDefaultDates } from '~/util/dates'

// Import components
import AppHeader from '~/components/layout/Header'
import Hero from '~/components/base/Hero'
import Sidebar from '~/components/layout/Sidebar'
import Banner from '~/components/base/Banner'
import Container from '~/components/layout/Container'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import LoginWrapper from '~/components/LoginWrapper'

// Import Supabase
import SupabaseClient from '~/util/supabase'

// Import utils
import { setPushNotifs } from '~/util/setPushNotifs'

export default {
  components: {
    AppHeader,
    Banner,
    Sidebar,
    Container,
    Hero,
    FromUntilPicker,
    LoginWrapper,
    PortalTarget,
  },
  async fetch() {
    if (!this.hasFetched) {
      const { from, until } = getDefaultDates()

      this.setUntil(until.toISOString().split('T')[0])
      this.setFrom(from.toISOString().split('T')[0])
    }

    if (this.allowLoading) this.setLoading(true)

    const getPagination = (page, size) => {
      const limit = size ? +size : 3
      const from = page ? page * limit : 0
      const to = page ? from + size - 1 : size - 1

      return { from, to }
    }

    const transactions = []
    let page = 0
    let data = {
      data: [],
      count: Infinity,
    }

    while (transactions.length < data.count) {
      const { from, to } = getPagination(page, 1e3)

      data = await SupabaseClient.from('transactions')
        .select('*', { count: 'exact' })
        .order('id', { ascending: true })
        .range(from, to)

      transactions.push(...data.data)
      page++
    }

    if (data.errors) {
      this.error = data.errors.join('\n')
    }

    await this.fetchInventory()
    await this.fetchRecipes()
    this.setPerson({
      transactions,
    })

    setPushNotifs(transactions)

    this.hasFetched = true

    this.setLoading(false)
  },
  fetchOnServer: false,
  data() {
    return {
      error: '',
      hasFetched: false,
      sidebarOpen: false,
      allowLoading: true,
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
    hasFoodTransactions() {
      const transactions = this.getPayments
      return (
        transactions.filter((v) => {
          const categories = v.categories.join(', ').toLowerCase()
          return categories.includes('food') || categories.includes('eten')
        }).length > 0
      )
    },
  },
  watch: {
    $route() {
      this.sidebarOpen = false
    },
  },
  mounted() {
    this.$nuxt.$on('refetch-really', () => {
      if ((this.getAllPayments || []).length === 0) this.$fetch()
    })

    eventBus.$on('force-refetch', async () => {
      this.allowLoading = false
      await this.$fetch()
      this.allowLoading = true
    })

    this.$nuxt.$on('refetch-inventory', () => {
      this.fetchInventory()
    })

    this.$nuxt.$on('refetch-recipes', () => {
      this.fetchRecipes()
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
    async fetchInventory() {
      const inventory = (
        await SupabaseClient.from('inventory')
          .select('*', { count: 'exact' })
          .order('id', { ascending: true })
          .range(0, 1e3)
      ).data

      this.setPerson({
        inventory,
      })
    },
    async fetchRecipes() {
      const recipes = (
        await SupabaseClient.from('recipes')
          .select('*', { count: 'exact' })
          .order('id', { ascending: true })
          .range(0, 1e3)
      ).data

      this.setPerson({
        recipes,
      })
    },
  },
  head() {
    return {
      bodyAttrs: {
        sidebarOpen: this.sidebarOpen,
      },
      script: [
        {
          src: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
        },
      ],
    }
  },
}
</script>
