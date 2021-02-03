<template>
  <div>
    <app-header title="Login" />
    <container>
      <Nuxt />
    </container>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
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
