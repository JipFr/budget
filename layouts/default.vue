<template>
  <div>
    <app-header />
    <div class="page">
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

export default {
  components: {
    AppHeader,
  },
  async fetch() {
    const { data } = await this.$axios('/user/get')
    const userData = data.data
    this.setPerson(userData)
  },
  fetchOnServer: false,
  methods: {
    ...mapMutations({
      setPerson: 'user/set',
    }),
  },
}
</script>
