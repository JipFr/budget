<template>
  <div>
    <container class="limited-width">
      <!-- Hero -->
      <hero />

      <!-- Payment list -->
      <h2>Payments</h2>
      <payment-list />
    </container>
  </div>
</template>

<script>
// Import components
import { Capacitor } from '@capacitor/core'
import Container from '~/components/layout/Container'
import Hero from '~/components/base/Hero'
import PaymentList from '~/components/base/PaymentList'

export default {
  components: {
    PaymentList,
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
