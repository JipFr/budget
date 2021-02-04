<template>
  <div class="hero" :class="isLoading ? 'loading' : ''">
    <div class="hero-layout">
      <card class="fw highlight">
        <subtitle>In this period...</subtitle>
        <h1>
          <money :cents="total" />
        </h1>
      </card>
      <card>
        <subtitle>Gained</subtitle>
        <h2>
          <money :cents="gained" />
        </h2>
      </card>
      <card>
        <subtitle>Spent</subtitle>
        <h2>
          <money :cents="spent" />
        </h2>
      </card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  padding: 40px 0;

  &.loading .money {
    background: var(--overlay-color);
    color: transparent;
  }
}
.hero-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;

  .fw {
    grid-column: 1 / -1;
  }
}
</style>

<script>
// Import components
import Card from '~/components/layout/Card'
import Subtitle from '~/components/title/Subtitle'
import Money from '~/components/title/Money'

export default {
  components: {
    Card,
    Subtitle,
    Money,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      gained: 0,
      spent: 0,
      total: 0,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.user.data.loading
    },
  },
  watch: {
    payments() {
      this.setData()
    },
  },
  methods: {
    setData() {
      // Re-set values
      this.gained = 0
      this.spent = 0
      this.total = 0

      // Now go over each transaction and add it to the relevant field
      for (const payment of this.payments) {
        if (!payment.categories.includes('exclude')) {
          this.total += payment.cents
          if (payment.cents > 0) {
            this.gained += payment.cents
          } else {
            this.spent += payment.cents * -1
          }
        }
      }
    },
  },
}
</script>
