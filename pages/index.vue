<template>
  <div class="container">
    <app-header />
    <div class="content">
      {{ platform }}
      <p v-if="platform === 'ios'">Status tapped: {{ statusTapped }}</p>
      <p
        v-for="i in Array(100)
          .fill(0)
          .map((v, i) => i)"
        :key="i"
      >
        Hallo: {{ i }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.content {
  margin-top: calc(60px + env(safe-area-inset-top));
}
p {
  padding: 10px;
  background: var(--content);
  margin-bottom: 1px;
}
</style>

<script>
// Import components
import { Capacitor } from '@capacitor/core'
import AppHeader from '~/components/layout/Header'

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      statusTapped: 0,
      platform: Capacitor.platform,
    }
  },
  mounted() {
    window.addEventListener('statusTap', () => {
      this.statusTapped++
    })
  },
}
</script>
