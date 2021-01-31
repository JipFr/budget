<template>
  <div>
    <app-header />
    <Nuxt />
  </div>
</template>

<script>
// Import Capacitor
import AppHeader from '~/components/layout/Header'

export default {
  components: {
    AppHeader,
  },
}
</script>
