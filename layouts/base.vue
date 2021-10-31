<template>
  <div>
    <app-header title="BudgetDuck" />
    <container class="app">
      <Nuxt />
    </container>
  </div>
</template>

<style lang="scss">
.container.app {
  margin-top: 120px;
  max-width: 520px;

  p {
    margin: 20px 0;
  }
}
</style>

<script>
// Import layout elements
import AppHeader from '~/components/layout/Header'
import Container from '~/components/layout/Container'

export default {
  components: {
    AppHeader,
    Container,
  },
}
</script>
