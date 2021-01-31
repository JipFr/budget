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
// Import Capacitor
import AppHeader from '~/components/layout/Header'

export default {
  components: {
    AppHeader,
  },
}
</script>
