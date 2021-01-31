<template>
  <div>
    <container class="limited-width">
      <hero />
    </container>
  </div>
</template>

<script>
// Import components
import { Capacitor } from '@capacitor/core'
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'

export default {
  components: {
    Container,
    Hero,
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
