<template>
  <div>
    <app-header title="Budget" />
    <div class="page">
      <div v-if="error">
        <container class="limited-width">
          <banner>⚠️ {{ error }}</banner>
        </container>
      </div>
      <Nuxt />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
}
</style>

<script>
import { mapMutations } from 'vuex'
import AppHeader from '~/components/layout/Header'
import Banner from '~/components/base/Banner'
import Container from '~/components/layout/Container'

export default {
  components: {
    AppHeader,
    Banner,
    Container,
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
