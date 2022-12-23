<template>
  <login-wrapper>
    <div class="page">
      <div v-if="error">
        <container class="limited-width">
          <banner>⚠️ {{ error }}</banner>
        </container>
      </div>
      <div class="main">
        <sidebar>
          <hero :payments="getPayments" />
          <div class="from-until">
            <hr />
            <from-until-picker class="padded padded-right" />
          </div>
        </sidebar>

        <div class="main-content">
          <container>
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

.main-content {
  border-top: 5px solid transparent;
}
.main-content-layout {
  padding: 50px 0;
}

hr {
  border: 0;
  width: 100%;
  height: 1px;
  background: var(--border);
}

@media (min-width: 1200px) {
  .main-content-layout {
    display: grid;
    grid-template-columns: 1fr 316px;
    grid-gap: 50px;
  }
}

@media (prefers-color-scheme: light) {
  .main-content {
    border-top-color: var(--theme);
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
import { getDefaultDates } from '~/util/dates'

// Import components
import Hero from '~/components/base/Hero'
import Sidebar from '~/components/layout/Sidebar'
import Banner from '~/components/base/Banner'
import Container from '~/components/layout/Container'
import FromUntilPicker from '~/components/base/inputs/FromUntilPicker'
import LoginWrapper from '~/components/LoginWrapper'

// Import Supabase
import SupabaseClient from '~/util/supabase'

function addTrailingSlash(arr) {
  return arr.flatMap((path) =>
    [path, !path.endsWith('/') ? path + '/' : null].filter(Boolean)
  )
}

export default {
  components: {
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

    this.setLoading(true)

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

    this.setPerson({
      transactions,
    })

    this.hasFetched = true

    this.setLoading(false)
  },
  fetchOnServer: false,
  data() {
    return {
      error: '',
      financePaths: addTrailingSlash(['/', '/categories', '/recurring']),
      chartPaths: addTrailingSlash(['/overview', '/prices', '/food']),
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
  mounted() {
    this.$nuxt.$on('refetch-really', () => {
      if ((this.getAllPayments || []).length === 0) this.$fetch()
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
